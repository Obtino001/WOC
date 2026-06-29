if (!customElements.get('main-product-wellness')) {
  class MainProductWellness extends HTMLElement {
    connectedCallback() {
      this.sectionId = this.dataset.sectionId;
      if (!this.sectionId || typeof subscribe !== 'function') return;

      this.variantChangeUnsubscriber = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
        if (event.data?.sectionId !== this.sectionId) return;
        this.updateSaleBadge(event.data.html);
        this.updateAtcLabel(event.data.html);
        this.updateSaveBadge(event.data.html);
      });
    }

    disconnectedCallback() {
      this.variantChangeUnsubscriber?.();
    }

    updateSaleBadge(html) {
      const source = html?.getElementById(`SaleBadge-${this.sectionId}`);
      const destination = document.getElementById(`SaleBadge-${this.sectionId}`);
      if (!destination) return;

      if (source && source.textContent.trim()) {
        destination.innerHTML = source.innerHTML;
        destination.style.display = '';
      } else {
        destination.style.display = 'none';
      }
    }

    updateAtcLabel(html) {
      const source = html?.getElementById(`ProductSubmitButton-${this.sectionId}`);
      const destination = document.getElementById(`ProductSubmitButton-${this.sectionId}`);
      if (!source || !destination) return;

      const sourceLabel = source.querySelector('[data-atc-label]');
      const destinationLabel = destination.querySelector('[data-atc-label]');
      if (sourceLabel && destinationLabel) {
        destinationLabel.innerHTML = sourceLabel.innerHTML;
      }
    }

    updateSaveBadge(html) {
      const source = html?.getElementById(`price-${this.sectionId}`);
      const destination = document.getElementById(`price-${this.sectionId}`);
      if (!source || !destination) return;

      const sourceBadge = source.querySelector('[data-save-badge]');
      const destinationBadge = destination.querySelector('[data-save-badge]');
      const sourceCompare = source.querySelector('[data-compare-price]');
      const destinationCompare = destination.querySelector('[data-compare-price]');

      if (sourceBadge && destinationBadge) {
        destinationBadge.innerHTML = sourceBadge.innerHTML;
        destinationBadge.style.display = '';
      } else if (destinationBadge) {
        destinationBadge.style.display = 'none';
      }

      if (sourceCompare && destinationCompare) {
        destinationCompare.innerHTML = sourceCompare.innerHTML;
        destinationCompare.style.display = '';
      } else if (destinationCompare) {
        destinationCompare.style.display = 'none';
      }
    }
  }

  customElements.define('main-product-wellness', MainProductWellness);
}
