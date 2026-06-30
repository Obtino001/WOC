if (!customElements.get('main-product-foot')) {
  class MainProductFoot extends HTMLElement {
    connectedCallback() {
      this.sectionId = this.dataset.sectionId;
      if (!this.sectionId) return;

      this.bindBundleSelector();

      if (typeof subscribe === 'function') {
        this.variantChangeUnsubscriber = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
          if (event.data?.sectionId !== this.sectionId) return;
          this.updateSaleBadge(event.data.html);
          this.syncBundleSelection(event.data.variant?.id);
        });
      }
    }

    disconnectedCallback() {
      this.variantChangeUnsubscriber?.();
      this.bundleRoot?.removeEventListener('change', this.onBundleChange);
    }

    getProductInfo() {
      return document.getElementById(`MainProduct-${this.sectionId}`)?.closest('product-info');
    }

    bindBundleSelector() {
      const section = document.getElementById(`MainProduct-${this.sectionId}`);
      this.bundleRoot = section?.querySelector('[data-bundle-selector]');
      if (!this.bundleRoot) return;

      this.onBundleChange = (event) => {
        const radio = event.target.closest('[data-variant-id]');
        if (!radio || radio.disabled) return;
        this.selectVariant(radio.dataset.variantId, radio.id);
      };

      this.bundleRoot.addEventListener('change', this.onBundleChange);
    }

    selectVariant(variantId, targetId) {
      const productInfo = this.getProductInfo();
      if (!productInfo || !variantId) return;

      this.bundleRoot?.querySelectorAll('.mpf-bundle__option').forEach((option) => {
        const input = option.querySelector('[data-variant-id]');
        option.classList.toggle('is-selected', input?.value === variantId);
      });

      fetch(`${productInfo.dataset.url}?variant=${variantId}&section_id=${this.sectionId}`)
        .then((response) => response.text())
        .then((responseText) => {
          const html = new DOMParser().parseFromString(responseText, 'text/html');
          const selectedVariantNode = html.querySelector('variant-selects [data-selected-variant]');
          const variant = selectedVariantNode?.innerHTML ? JSON.parse(selectedVariantNode.innerHTML) : null;

          ['price', 'Inventory'].forEach((id) => {
            const source = html.getElementById(`${id}-${this.sectionId}`);
            const destination = productInfo.querySelector(`#${id}-${this.sectionId}`);
            if (source && destination) destination.innerHTML = source.innerHTML;
          });

          productInfo.querySelectorAll('input[name="id"]').forEach((input) => {
            input.value = variantId;
            input.dispatchEvent(new Event('change', { bubbles: true }));
          });

          if (productInfo.dataset.updateUrl !== 'false') {
            window.history.replaceState({}, '', `${productInfo.dataset.url}?variant=${variantId}`);
          }

          if (typeof publish === 'function') {
            publish(PUB_SUB_EVENTS.variantChange, {
              data: {
                sectionId: this.sectionId,
                html,
                variant,
              },
            });
          }

          document.querySelector(`#${targetId}`)?.focus();
        })
        .catch((error) => console.error(error));
    }

    syncBundleSelection(variantId) {
      if (!variantId || !this.bundleRoot) return;

      this.bundleRoot.querySelectorAll('[data-variant-id]').forEach((radio) => {
        radio.checked = radio.value === String(variantId);
      });

      this.bundleRoot.querySelectorAll('.mpf-bundle__option').forEach((option) => {
        const input = option.querySelector('[data-variant-id]');
        option.classList.toggle('is-selected', input?.checked);
      });
    }

    updateSaleBadge(html) {
      const destination = document.getElementById(`SaleBadge-${this.sectionId}`);
      if (!destination || destination.dataset.staticBadge === 'true') return;

      const source = html?.getElementById(`SaleBadge-${this.sectionId}`);
      if (source && source.textContent.trim()) {
        destination.innerHTML = source.innerHTML;
        destination.style.display = '';
      } else {
        destination.style.display = 'none';
      }
    }
  }

  customElements.define('main-product-foot', MainProductFoot);
}
