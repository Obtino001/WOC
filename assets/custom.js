/**
 * World of Comfort - Custom Web Components
 * Encapsulates interactive B2B and section functionalities.
 */

// 1. ROI Calculator Web Component
class RoiCalculator extends HTMLElement {
  connectedCallback() {
    const monthlyPrice = parseInt(this.getAttribute('monthly-price') || '1500', 10);
    const annualPrice = monthlyPrice * 12;

    // Sick leave panel inputs
    const empSlider = this.querySelector('#slider-employees');
    const empVal = this.querySelector('#val-employees');
    const salSlider = this.querySelector('#slider-salary');
    const salVal = this.querySelector('#val-salary');
    const curSickSlider = this.querySelector('#slider-current-sick');
    const curSickVal = this.querySelector('#val-current-sick');
    const tarSickSlider = this.querySelector('#slider-target-sick');
    const tarSickVal = this.querySelector('#val-target-sick');

    // Sick leave outputs
    const outCurCost = this.querySelector('#out-current-cost');
    const outNewCost = this.querySelector('#out-new-cost');
    const outGrossSave = this.querySelector('#out-gross-save');
    const outAnnPrice = this.querySelector('#out-annual-price');
    const outNetSave = this.querySelector('#out-net-save');
    const outRoi = this.querySelector('#out-roi');
    const outPayback = this.querySelector('#out-payback');

    // Sessions panel inputs (React: SessionCalculator)
    const sessionsPerDaySlider = this.querySelector('#slider-sessions-per-day') || this.querySelector('#slider-sess-employees');
    const sessionsPerDayVal = this.querySelector('#val-sessions-per-day') || this.querySelector('#val-sess-employees');

    // Sessions outputs
    const outMinutesPerDay = this.querySelector('#out-minutes-per-day');
    const outSessCostPerSess = this.querySelector('#out-cost-per-session-header') || this.querySelector('#out-per-session-cost');
    const outSessPerDayDetail = this.querySelector('#out-sess-per-day-detail') || this.querySelector('#out-total-sessions');
    const outSessPerMonthDetail = this.querySelector('#out-sess-per-month-detail') || this.querySelector('#out-equivalent-cost');
    const outSessMonthlyCostDetail = this.querySelector('#out-sess-monthly-cost-detail') || this.querySelector('#out-sess-annual-price');
    const outSessTotalSess = this.querySelector('#out-total-sessions');
    const outSessEquivCost = this.querySelector('#out-equivalent-cost');
    const outSessAnnPrice = this.querySelector('#out-sess-annual-price');
    const outSessNetSave = this.querySelector('#out-sess-net-save');
    const outSessRoi = this.querySelector('#out-sess-roi');
    const outPerSessCost = this.querySelector('#out-per-session-cost');

    // Tab buttons and panels
    const tabTriggers = this.querySelectorAll('.tab-trigger');
    const tabPanels = this.querySelectorAll('.tab-panel');

    const formatDanish = (num, isPercent = false, decimals = 0) => {
      const formatted = num.toLocaleString('da-DK', { 
        minimumFractionDigits: decimals, 
        maximumFractionDigits: decimals 
      });
      if (isPercent) return formatted + ' %';
      return formatted + ' kr.';
    };

    const updateSliderProgress = (slider) => {
      if (!slider) return;
      const min = parseFloat(slider.min) || 0;
      const max = parseFloat(slider.max) || 100;
      const val = parseFloat(slider.value) || 0;
      const percent = ((val - min) / (max - min)) * 100;
      slider.style.background = `linear-gradient(to right, var(--color-gold, #d8b261) 0%, var(--color-gold, #d8b261) ${percent}%, #374151 ${percent}%, #374151 100%)`;
    };

    const calculateSickLeave = () => {
      if (!empSlider) return;
      const employees = parseInt(empSlider.value, 10);
      const salary = parseInt(salSlider.value, 10);
      const currentSick = parseFloat(curSickSlider.value);
      const targetSick = parseFloat(tarSickSlider.value);

      // Display inputs
      if (empVal) empVal.textContent = employees;
      if (salVal) salVal.innerHTML = formatDanish(salary).replace(/\s/g, '&nbsp;');
      if (curSickVal) curSickVal.textContent = currentSick + ' %';
      if (tarSickVal) tarSickVal.textContent = targetSick + ' %';

      // Calculations
      const currentCost = Math.round(employees * salary * 12 * (currentSick / 100));
      const newCost = Math.round(employees * salary * 12 * (targetSick / 100));
      const grossSavings = currentCost - newCost;
      const netSavings = grossSavings - annualPrice;
      const roi = annualPrice > 0 ? Math.round((grossSavings / annualPrice) * 100) : 0;

      let paybackText = "1 month";
      if (grossSavings > 0) {
        const monthlyGross = grossSavings / 12;
        const paybackMonths = Math.ceil(monthlyPrice / monthlyGross);
        paybackText = paybackMonths > 1 ? paybackMonths + " months" : "1 month";
      } else {
        paybackText = "-";
      }

      // Display outputs
      if (outCurCost) outCurCost.innerHTML = formatDanish(currentCost).replace(/\s/g, '&nbsp;');
      if (outNewCost) outNewCost.innerHTML = formatDanish(newCost).replace(/\s/g, '&nbsp;');
      if (outGrossSave) outGrossSave.innerHTML = formatDanish(grossSavings).replace(/\s/g, '&nbsp;');
      if (outAnnPrice) outAnnPrice.innerHTML = formatDanish(annualPrice).replace(/\s/g, '&nbsp;');
      if (outNetSave) outNetSave.innerHTML = formatDanish(netSavings).replace(/\s/g, '&nbsp;');
      if (outRoi) outRoi.textContent = roi + '%';
      if (outPayback) outPayback.textContent = paybackText;

      updateSliderProgress(empSlider);
      updateSliderProgress(salSlider);
      updateSliderProgress(curSickSlider);
      updateSliderProgress(tarSickSlider);
    };

    const calculateSessions = () => {
      if (!sessionsPerDaySlider) return;
      const sessionsPerDay = parseInt(sessionsPerDaySlider.value, 10);
      
      if (sessionsPerDayVal) sessionsPerDayVal.textContent = sessionsPerDay;

      // Calculations matching React WellnessCalculator
      const SESSION_MINUTES = 15;
      const WORK_DAYS_PER_MONTH = 22;
      
      const sessionsPerMonth = sessionsPerDay * WORK_DAYS_PER_MONTH;
      const costPerSession = sessionsPerMonth > 0 ? monthlyPrice / sessionsPerMonth : 0;
      const minutesPerDay = sessionsPerDay * SESSION_MINUTES;

      // Update UI elements in DOM
      if (outMinutesPerDay) outMinutesPerDay.textContent = minutesPerDay + ' min';
      
      // Cost per session display
      if (outSessCostPerSess) outSessCostPerSess.innerHTML = formatDanish(costPerSession, false, 1).replace(/\s/g, '&nbsp;');
      if (outPerSessCost) outPerSessCost.innerHTML = formatDanish(costPerSession, false, 1).replace(/\s/g, '&nbsp;');

      // Session detail list rows
      if (outSessPerDayDetail) outSessPerDayDetail.textContent = sessionsPerDay;
      if (outSessPerMonthDetail) outSessPerMonthDetail.textContent = sessionsPerMonth;
      if (outSessMonthlyCostDetail) outSessMonthlyCostDetail.innerHTML = formatDanish(monthlyPrice).replace(/\s/g, '&nbsp;');

      // Fallback variables if the elements have the same ID names as sick leave results
      if (outSessTotalSess) outSessTotalSess.textContent = sessionsPerDay;
      if (outSessEquivCost) outSessEquivCost.textContent = sessionsPerMonth;
      if (outSessAnnPrice) outSessAnnPrice.innerHTML = formatDanish(monthlyPrice).replace(/\s/g, '&nbsp;');

      updateSliderProgress(sessionsPerDaySlider);
    };

    // Bind event listeners
    if (empSlider) empSlider.addEventListener('input', calculateSickLeave);
    if (salSlider) salSlider.addEventListener('input', calculateSickLeave);
    if (curSickSlider) curSickSlider.addEventListener('input', calculateSickLeave);
    if (tarSickSlider) tarSickSlider.addEventListener('input', calculateSickLeave);

    if (sessionsPerDaySlider) sessionsPerDaySlider.addEventListener('input', calculateSessions);

    // Initial calculations
    calculateSickLeave();
    calculateSessions();

    // Tab triggering logic
    tabTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        tabTriggers.forEach(t => {
          t.setAttribute('aria-selected', 'false');
          t.setAttribute('data-state', 'inactive');
          t.classList.remove('bg-card', 'text-white', 'shadow-sm');
          t.classList.add('text-muted-foreground');
        });

        trigger.setAttribute('aria-selected', 'true');
        trigger.setAttribute('data-state', 'active');
        trigger.classList.add('bg-card', 'text-white', 'shadow-sm');
        trigger.classList.remove('text-muted-foreground');

        const targetPanelId = trigger.getAttribute('aria-controls');
        tabPanels.forEach(panel => {
          if (panel.id === targetPanelId) {
            panel.removeAttribute('hidden');
            panel.setAttribute('data-state', 'active');
            panel.classList.add('active');
          } else {
            panel.setAttribute('hidden', '');
            panel.setAttribute('data-state', 'inactive');
            panel.classList.remove('active');
          }
        });
      });
    });
  }
}
customElements.define('roi-calculator', RoiCalculator);


// 2. Animated Counter Web Component
class AnimatedCounter extends HTMLElement {
  connectedCallback() {
    const valueAttr = this.getAttribute('value') || '0';
    // Extract integer value and optional suffixes (like %, +, M, k)
    const match = valueAttr.match(/^([\d\.]+)(.*)$/);
    if (!match) return;

    const numericValue = parseFloat(match[1]);
    const originalSuffix = match[2] || this.getAttribute('suffix') || '';
    const duration = parseInt(this.getAttribute('duration') || '1800', 10);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCount(numericValue, duration, originalSuffix);
          observer.unobserve(this);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this);
  }

  animateCount(value, duration, suffix) {
    let start = 0;
    const startTime = performance.now();
    const isDecimal = !Number.isInteger(value);

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing outQuad
      const easedProgress = progress * (2 - progress);
      const current = isDecimal 
        ? (easedProgress * value).toFixed(1).replace('.', ',')
        : Math.floor(easedProgress * value).toLocaleString('da-DK');
      
      this.render(current, suffix);
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        const finalVal = isDecimal ? value.toFixed(1).replace('.', ',') : value.toLocaleString('da-DK');
        this.render(finalVal, suffix);
      }
    };

    requestAnimationFrame(tick);
  }

  render(value, suffix) {
    if (suffix) {
      this.innerHTML = `${value}<span class="text-3xl md:text-4xl lg:text-5xl font-light ml-0.5 opacity-60 text-[#a64030]">${suffix}</span>`;
    } else {
      this.textContent = value;
    }
  }
}
customElements.define('animated-counter', AnimatedCounter);


// 3. Floating Demo Modal Web Component
class WocFloatingDemo extends HTMLElement {
  connectedCallback() {
    const trigger = this.querySelector('#woc-floating-trigger');
    const modal = this.querySelector('#woc-demo-modal');
    const closeBtn = this.querySelector('#woc-modal-close');

    if (trigger && modal && closeBtn) {
      trigger.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      });

      closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      });

      // Window event matching React global booking triggers
      window.addEventListener('open-book-demo', (e) => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        const detail = e.detail || {};
        if (detail.type) {
          if (typeof window.selectWocDemoType === 'function') {
            window.selectWocDemoType(detail.type);
          }
        }
        if (detail.productName) {
          const msgInput = this.querySelector('#woc-input-message');
          if (msgInput) {
            msgInput.value = "Interesseret i: " + detail.productName;
          }
        }
      });
    }
  }
}
customElements.define('woc-floating-demo-element', WocFloatingDemo);
