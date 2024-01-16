<style>
    /* Add some basic styling for the layout */
    .body-artwork {
        font-family: Arial, sans-serif;
        background-color: #f0f0f0;
        margin: 0;
    }

    .h1-artwork {
        padding: 0px;
        margin: 0px;
        font-size: 75px;
    }

    .container-artwork {
        max-width: 100%;
        height: 85vh;
        margin: 0 auto;
        padding-top: 5%;
        background-color: #A7C7E7;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        display: flex;
    }

    .artwork-section {
        flex: 2;
        font-size: 18px;
        line-height: 1.6;
        margin: 200px;
    }

    .artwork-images {
        flex: 3;
        padding: 3px; /* Add padding for spacing */
        margin: 3px;
        display: flex;
        flex-wrap: wrap; /* Wrap images to the next line if they don't fit horizontally */
        justify-content: space-around; /* Distribute images evenly on the line */
        margin-top: 2px;
        margin-bottom: 2px;
    }

    .artwork-image {
        width: 250px; /* Adjust the width as needed */
        height: auto; /* Maintain aspect ratio */
        padding: 3x;
        margin-bottom: 2px;
        margin-top: 2px;
        transition: transform 0.5s;
    }

    .artwork-image:hover {
        transform: scale(1.1); /* Enlarge the image on hover */
    }

    .artwork-image-row {
        display: flex;
        justify-content: space-around;
        flex-wrap: wrap;
        padding: 0px;
        margin-top: 0px;
        margin-bottom: 0px;
    }
</style>

<body class="body-artwork">
    <div class="container-artwork">
        <div class="artwork-section">
            <h1 class="h1-artwork">My Artwork</h1>
            <p>These are my artworks. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae neque ac justo
                malesuada luctus. Nullam eleifend, justo at viverra tristique, dui sapien volutpat nisi, et volutpat libero
                justo a nisl. Fusce id quam ac nisi finibus volutpat. Curabitur auctor felis non velit auctor tincidunt.</p>
        </div>
        <div class="artwork-images">
            <div class="artwork-image-row">
                <div class="img-container">
                    <a href="https://google.com" target="_blank">
                        <img src="Icons/p1.jpg" alt="Artwork 1" class="artwork-image">
                    </a>
                    <a href="https://google.com" target="_blank">
                        <img src="Icons/p1.jpg" alt="Artwork 1" class="artwork-image">
                    </a>
                    <a href="https://google.com" target="_blank">
                        <img src="Icons/p1.jpg" alt="Artwork 1" class="artwork-image">
                    </a>
                </div>
            </div>
            <div class="artwork-image-row">
                <div class="img-container">
                    <a href="https://google.com" target="_blank">
                        <img src="Icons/p1.jpg" alt="Artwork 1" class="artwork-image">
                    </a>
                    <a href="https://google.com" target="_blank">
                        <img src="Icons/p1.jpg" alt="Artwork 1" class="artwork-image">
                    </a>
                    <a href="https://google.com" target="_blank">
                        <img src="Icons/p1.jpg" alt="Artwork 1" class="artwork-image">
                    </a>
                </div>
            </div>
        </div>
        
    </div>
</body>
