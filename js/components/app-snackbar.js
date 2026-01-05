/**
 * Global Snackbar Component
 */
class AppSnackbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <link rel="stylesheet" href="css/style.css">
            <link rel="stylesheet" href="css/components/app-snackbar.css">
        `;
    }

    show(message, type = 'info', duration = 4000) {
        const snackbar = document.createElement('div');
        snackbar.className = `snackbar ${type}`;
        
        const iconMap = {
            success: 'fa-check-circle',
            danger: 'fa-exclamation-circle',
            info: 'fa-info-circle'
        };

        snackbar.innerHTML = `
            <i class="fas ${iconMap[type]} icon"></i>
            <div class="content">${message}</div>
            <button class="close-btn"><i class="fas fa-times"></i></button>
        `;

        this.shadowRoot.appendChild(snackbar);

        const close = () => {
            snackbar.classList.add('leaving');
            setTimeout(() => snackbar.remove(), 300);
        };

        snackbar.querySelector('.close-btn').onclick = close;

        if (duration > 0) {
            setTimeout(close, duration);
        }
    }
}

customElements.define('app-snackbar', AppSnackbar);