// Modified version of pantrygallery.js

document.addEventListener('DOMContentLoaded', () => {
    const galleryContainer = document.getElementById('gallery-container');
    const mediaModal = document.getElementById('media-modal');
    const modalMediaContainer = document.getElementById('modal-media-container');
    const closeModal = document.querySelector('.close-modal');

    // Function to get Google Drive file ID and type
    function getGoogleDriveInfo(url) {
        let fileId = '';
        
        // Extract file ID from various Google Drive URL formats
        if (url.includes('/file/d/')) {
            fileId = url.split('/file/d/')[1].split('/')[0];
        } else if (url.includes('id=')) {
            fileId = url.split('id=')[1].split('&')[0];
        }
        
        if (!fileId) return null;

        return {
            fileId: fileId,
            thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}`,
            embedUrl: `https://drive.google.com/file/d/${fileId}/preview`
        };
    }

    function createMediaElement(media) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('gallery-item');

        let mediaElement;

        // Handle Google Drive links
        if (media.src.includes('drive.google.com')) {
            const driveInfo = getGoogleDriveInfo(media.src);
            if (driveInfo) {
                // Create thumbnail image
                mediaElement = document.createElement('img');
                mediaElement.src = driveInfo.thumbnailUrl;
                mediaElement.alt = media.title || 'Google Drive Media';
                
                // Store embed URL for modal
                itemDiv.dataset.embedUrl = driveInfo.embedUrl;
                
                // Add play button overlay
                const playButton = document.createElement('div');
                playButton.innerHTML = `
                    <svg viewBox="0 0 24 24" width="48" height="48">
                        <circle cx="12" cy="12" r="10" fill="rgba(0,0,0,0.5)"/>
                        <path d="M10 8l6 4-6 4V8z" fill="white"/>
                    </svg>`;
                playButton.style.position = 'absolute';
                playButton.style.top = '50%';
                playButton.style.left = '50%';
                playButton.style.transform = 'translate(-50%, -50%)';
                itemDiv.appendChild(playButton);
            }
        } else {
            // Handle regular images/videos as before
            const extension = media.src.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                mediaElement = document.createElement('img');
                mediaElement.src = media.src;
                mediaElement.alt = media.title || 'Image';
            } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
                mediaElement = document.createElement('video');
                mediaElement.src = media.src;
                mediaElement.muted = true;
                mediaElement.playsInline = true;
            }
        }

        if (mediaElement) {
            // Add overlay with title
            const overlay = document.createElement('div');
            overlay.classList.add('gallery-item-overlay');
            overlay.textContent = media.title || '';
            
            itemDiv.appendChild(mediaElement);
            itemDiv.appendChild(overlay);

            // Add click handler
            itemDiv.addEventListener('click', () => {
                openModal(media, itemDiv.dataset.embedUrl);
            });
        }

        return itemDiv;
    }

    function openModal(media, embedUrl) {
        modalMediaContainer.innerHTML = '';
        
        if (embedUrl) {
            // For Google Drive content
            const iframe = document.createElement('iframe');
            iframe.src = embedUrl;
            iframe.width = '100%';
            iframe.height = '80vh';
            iframe.frameBorder = '0';
            iframe.allowFullscreen = true;
            modalMediaContainer.appendChild(iframe);
        } else {
            // For regular media
            const extension = media.src.split('.').pop().toLowerCase();
            if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
                const img = document.createElement('img');
                img.src = media.src;
                img.alt = media.title || 'Image';
                modalMediaContainer.appendChild(img);
            } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
                const video = document.createElement('video');
                video.src = media.src;
                video.controls = true;
                video.autoplay = true;
                modalMediaContainer.appendChild(video);
            }
        }
        
        mediaModal.style.display = 'block';
    }

    // Close modal functionality
    closeModal.addEventListener('click', () => {
        modalMediaContainer.innerHTML = '';
        mediaModal.style.display = 'none';
    });

    // Example usage
    const sampleMedia = [
        // Example with Google Drive link
        { 
            src: 'https://drive.google.com/file/d/1DxoEQnX6fTZRH4RG0H_x9iB1bhPxEWd3/view?usp=sharing',
            title: 'Google Drive Media'
        },
        // Example with local image
        {
            src: 'https://drive.google.com/file/d/1W4xWNQPLnq0P6CnSvnLn39fEGw7sAXPL/view?usp=sharing',
            title: 'Local Image'
        }
    ];

    // Add media to gallery
    sampleMedia.forEach(media => {
        const mediaElement = createMediaElement(media);
        if (mediaElement) {
            galleryContainer.appendChild(mediaElement);
        }
    });
});


// Add to your pantrygallery.js

function createMediaElement(media) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('gallery-item');

    // Create loading spinner
    const spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    itemDiv.appendChild(spinner);

    if (media.src.includes('drive.google.com')) {
        const driveInfo = getGoogleDriveInfo(media.src);
        if (driveInfo) {
            // Create thumbnail with enhanced play button
            const thumbnail = document.createElement('img');
            thumbnail.src = driveInfo.thumbnailUrl;
            thumbnail.alt = media.title || 'Google Drive Media';
            thumbnail.onload = () => spinner.remove();

            const playButton = document.createElement('div');
            playButton.classList.add('play-button');
            
            itemDiv.dataset.embedUrl = driveInfo.embedUrl;
            itemDiv.appendChild(thumbnail);
            itemDiv.appendChild(playButton);
        }
    } else {
        // Handle regular media
        const mediaElement = createAppropriateMediaElement(media);
        if (mediaElement) {
            mediaElement.onload = () => spinner.remove();
            itemDiv.appendChild(mediaElement);
        }
    }

    // Enhanced overlay
    const overlay = document.createElement('div');
    overlay.classList.add('gallery-item-overlay');
    
    const title = document.createElement('div');
    title.textContent = media.title || '';
    title.style.fontSize = '1.1em';
    overlay.appendChild(title);

    itemDiv.appendChild(overlay);
    
    // Enhanced click handler
    itemDiv.addEventListener('click', () => {
        openEnhancedModal(media, itemDiv.dataset.embedUrl);
    });

    return itemDiv;
}

function openEnhancedModal(media, embedUrl) {
    modalMediaContainer.innerHTML = '';
    
    // Add loading spinner to modal
    const spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    modalMediaContainer.appendChild(spinner);

    if (embedUrl) {
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.allowFullscreen = true;
        iframe.onload = () => spinner.remove();
        modalMediaContainer.appendChild(iframe);
    } else {
        const mediaElement = createAppropriateMediaElement(media);
        if (mediaElement) {
            mediaElement.onload = () => spinner.remove();
            modalMediaContainer.appendChild(mediaElement);
        }
    }
    
    mediaModal.style.display = 'block';
    
    // Add fade-in animation
    modalMediaContainer.style.opacity = '0';
    setTimeout(() => {
        modalMediaContainer.style.opacity = '1';
        modalMediaContainer.style.transition = 'opacity 0.3s ease';
    }, 50);
}

// Helper function to create appropriate media element
function createAppropriateMediaElement(media) {
    const extension = media.src.split('.').pop().toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        const img = document.createElement('img');
        img.src = media.src;
        img.alt = media.title || 'Image';
        return img;
    } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
        const video = document.createElement('video');
        video.src = media.src;
        video.controls = true;
        video.playsInline = true;
        return video;
    }
    
    return null;
}