document.getElementById('upload-button').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            document.getElementById('profile-picture').src = reader.result;
        };
        reader.readAsDataURL(file);
    };
    input.click();
});

document.querySelectorAll('.sticker-option').forEach(sticker => {
    sticker.addEventListener('click', () => {
        addSticker(sticker.src);
    });
});

function addSticker(src) {
    const container = document.getElementById('profile-picture-container');
    const wrapper = document.createElement('div');
    wrapper.className = 'sticker-wrapper';
    wrapper.style.left = '100px';
    wrapper.style.top = '100px';

    const img = document.createElement('img');
    img.src = src;
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.userSelect = 'none';
    img.draggable = false;

    const deleteButton = document.createElement('div');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = '×'; // Çarpı işareti
    deleteButton.addEventListener('click', () => {
        container.removeChild(wrapper); // Sticker'ı kaldır
    });

    // Sticker yüklendikten sonra wrapper'ı ekle
    img.onload = () => {
        const resizer = document.createElement('div');
        resizer.className = 'resizer';

        const rotator = document.createElement('div');
        rotator.className = 'rotator';

        wrapper.appendChild(img);
        wrapper.appendChild(resizer);
        wrapper.appendChild(rotator);
        wrapper.appendChild(deleteButton); // Silme butonunu ekle
        container.appendChild(wrapper);

        enableDrag(wrapper);
        enableResize(wrapper, resizer);
        enableRotate(wrapper, rotator);
    };
}

function enableDrag(el) {
    let offsetX, offsetY;
    el.addEventListener('mousedown', e => {
        if (e.target.classList.contains('resizer') || e.target.classList.contains('rotator')) return;
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        function move(e2) {
            el.style.left = `${e2.clientX - offsetX}px`;
            el.style.top = `${e2.clientY - offsetY}px`;
        }
        function stop() {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
        }
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
    });
}

function enableResize(wrapper, handle) {
    handle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const img = wrapper.querySelector('img');
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = img.clientWidth;
        const startHeight = img.clientHeight;

        function resize(e2) {
            const dx = e2.clientX - startX;
            const dy = e2.clientY - startY;
            img.style.width = `${startWidth + dx}px`;
            img.style.height = `${startHeight + dy}px`;
        }

        function stop() {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stop);
        }

        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stop);
    });
}

function enableRotate(wrapper, handle) {
    handle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const centerX = wrapper.offsetLeft + wrapper.offsetWidth / 2;
        const centerY = wrapper.offsetTop + wrapper.offsetHeight / 2;

        function rotate(e2) {
            const dx = e2.clientX - centerX;
            const dy = e2.clientY - centerY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            wrapper.style.transform = `rotate(${angle}deg)`;
        }

        function stop() {
            window.removeEventListener('mousemove', rotate);
            window.removeEventListener('mouseup', stop);
        }

        window.addEventListener('mousemove', rotate);
        window.addEventListener('mouseup', stop);
    });
}

document.getElementById('download-button').addEventListener('click', () => {
    const container = document.getElementById('profile-picture-container');

    // Büyütme, döndürme ve silme noktalarını gizle
    const controls = container.querySelectorAll('.resizer, .rotator, .delete-button');
    controls.forEach(control => control.classList.add('hidden'));

    html2canvas(container, {
        useCORS: true, // CORS uyumluluğu
        allowTaint: true, // Görselleri tanımaya izin verir
        scrollX: 0, // Sayfa kaydırması
        scrollY: -window.scrollY // Y ekseninde kaydırma
    }).then(canvas => {
        // İndirme işlemi
        const link = document.createElement('a');
        link.download = 'stickered-profile.png';
        link.href = canvas.toDataURL('image/png');
        link.click();

        // Kontrolleri tekrar görünür yap
        controls.forEach(control => control.classList.remove('hidden'));
    });
});
function enableDrag(el) {
    let startX, startY, initialLeft, initialTop;
    let isDragging = false;

    el.addEventListener('mousedown', e => {
        if (e.target.classList.contains('resizer') || e.target.classList.contains('rotator')) return;

        isDragging = true;
        const rect = el.getBoundingClientRect();
        startX = e.clientX;
        startY = e.clientY;
        initialLeft = rect.left;
        initialTop = rect.top;

        function move(e2) {
            if (!isDragging) return;
            const dx = e2.clientX - startX;
            const dy = e2.clientY - startY;
            el.style.left = `${initialLeft + dx - el.offsetParent.getBoundingClientRect().left}px`;
            el.style.top = `${initialTop + dy - el.offsetParent.getBoundingClientRect().top}px`;
        }

        function stop() {
            isDragging = false;
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', stop);
        }

        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', stop);
    });
}

function enableResize(wrapper, handle) {
    handle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const img = wrapper.querySelector('img');
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = img.clientWidth;
        const startHeight = img.clientHeight;

        function resize(e2) {
            const dx = e2.clientX - startX;
            const dy = e2.clientY - startY;
            img.style.width = `${Math.max(50, startWidth + dx)}px`;
            img.style.height = `${Math.max(50, startHeight + dy)}px`;
        }

        function stop() {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stop);
        }

        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stop);
    });
}

function enableRotate(wrapper, handle) {
    handle.addEventListener('mousedown', function (e) {
        e.stopPropagation();
        const rect = wrapper.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        function rotate(e2) {
            const dx = e2.clientX - centerX;
            const dy = e2.clientY - centerY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            wrapper.style.transform = `rotate(${angle}deg)`;
        }

        function stop() {
            window.removeEventListener('mousemove', rotate);
            window.removeEventListener('mouseup', stop);
        }

        window.addEventListener('mousemove', rotate);
        window.addEventListener('mouseup', stop);
    });
}