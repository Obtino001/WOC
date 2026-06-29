if (!customElements.get('main-product-clean')) {
  class MainProductClean extends HTMLElement {
    connectedCallback() {
      this.sectionId = this.dataset.sectionId;
      if (!this.sectionId || typeof subscribe !== 'function') return;

      this.variantChangeUnsubscriber = subscribe(PUB_SUB_EVENTS.variantChange, (event) => {
        if (event.data?.sectionId !== this.sectionId) return;
        this.updateSaleBadge(event.data.html);
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
  }

  customElements.define('main-product-clean', MainProductClean);
}
