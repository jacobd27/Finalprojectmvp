document.addEventListener('DOMContentLoaded', function() {
    if (document.body.classList.contains('homepage')) {
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
    }

if (document.getElementById('vanta-bg')) {
        VANTA.GLOBE({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x5b6ee1,
            backgroundColor: 0xffffff,
            size: 1.00
        });
    }
    
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});