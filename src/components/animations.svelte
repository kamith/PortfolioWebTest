<style>
    /* Add some basic styling for the layout */
    .body-animations {
        font-family: Arial, sans-serif;
        background-color: #36454F;
        margin: 0px;
        padding-top: 0px;
    }

    .h1-animations {
        padding: 0px;
        margin: 0px;
        font-size: 75px;
    }


    /* Style for arranging images in 2 rows */
    .animations-image-row {
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
    }

    .animation-images {
        flex: 3;
        padding: 0%; /* Add padding for spacing */
        flex-wrap: wrap; /* Wrap images to the next line if they don't fit horizontally */
        justify-content: space-around; /* Distribute images evenly on the line */
    }

    .animation-image {
        width: 100%; /* Adjust the width as needed */
        height: auto; /* Maintain aspect ratio */
        max-height: 165px;
        padding: 25px;
        margin-bottom: 2px;
        margin-top: 2px;
        transition: transform 0.75s;
    }

    .animation-image:hover {
        transform: scale(1.4); /* Enlarge the image on hover */
    }

    .animations-section {
        font-family: Arial, sans-serif;
        color: #FFFFFF;
        flex: 2;
        font-size: 18px;
        line-height: 1.6;
        padding-top: 5%;
        padding-bottom: 5%;
        justify-content: center;
        align-items: center;
    }

    .animations-captions {
        font-family: Arial, sans-serif;
        margin-top: 2px;
        margin-bottom: 2px;
        font-size: 18px;
        color: #FFFFFF;
        text-align: center;
    }

    /* Style the text boxes */
    .animations-text-box {
        font-size: 15px;
        width: 250px;
        color: #FFFFFF;
        padding: 5px;
        margin-top: 0px;
        margin-bottom: 0px;
        text-align: center;
    }

</style>
<body class="body-animations">
        <div class="animations-section">
            <h1 class="h1-animations">My Animations</h1>
            <p style="margin-left: 20%; margin-right: 20%;">These are my animations. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Sed vitae neque ac justo malesuada luctus. Nullam eleifend, justo at viverra tristique, 
                dui sapien volutpat nisi, et volutpat libero justo a nisl. Fusce id quam ac nisi finibus 
                volutpat. Curabitur auctor felis non velit auctor tincidunt.</p>
            <div class="animation-images">
                <div class="animations-image-row">
                    <div class="img-container">
                        <a href="https://google.com" target="_blank">
                            <img src="Icons/Medairorsquin.png" alt="Medairorsuin" class="animation-image">
                        </a>
                        <div class="animations-captions">
                            Medairorsuin
                        </div>
                        <div class="animations-text-box">
                            An experimental, out-of-body journey through my dreamscape in different mediums
                        </div>
                    </div>
                    <div class="img-container">
                        <a href="https://google.com" target="_blank">
                            <img src="Icons/Excessive.png" alt="Excessive" class="animation-image">
                        </a>
                        <div class="animations-captions">
                            Excessive
                        </div>
                        <div class="animations-text-box">
                            A crazy dream I had about excessive armpit hair growth
                        </div>
                    </div>
                    <div class="img-container">
                        <a href="https://google.com" target="_blank">
                            <img src="Icons/Priscilla.png" alt="Priscilla" class="animation-image">
                        </a>
                        <div class="animations-captions">
                            Priscilla
                        </div>
                        <div class="animations-text-box">
                            The daily activities of my old roommate's pet hedgehog and her favorite toilet paper tube
                        </div>
                    </div>
                    <div class="img-container">
                        <a href="https://google.com" target="_blank">
                            <img src="Icons/Wheres_my_ear.png" alt="Where's my ear?" class="animation-image">
                        </a>
                        <div class="animations-captions">
                            Where's my ear?
                        </div>
                        <div class="animations-text-box">
                            A monkey that bites off more than he can chew
                        </div>
                    </div>
                </div>
                <div class="animations-image-row">
                    <div class="img-container">
                        <a href="https://google.com" target="_blank">
                            <img src="Icons/Metamorph.png" alt="Metamorph" class="animation-image">
                        </a>
                        <div class="animations-captions">
                            Metamorph
                        </div>
                        <div class="animations-text-box">
                            Clay morphing into different things
                        </div>
                    </div>
                    <div class="img-container">
                        <a href="https://google.com" target="_blank">
                            <img src="Icons/My_Name.png" alt="My Name" class="animation-image">
                        </a>
                        <div class="animations-captions">
                            My Name
                        </div>
                        <div class="animations-text-box">
                            A little old lady spells out my name through knitting
                        </div>
                    </div>
                    <div class="img-container">
                        <a href="https://google.com" target="_blank">
                            <img src="Icons/Quinoa.png" alt="Quinoa" class="animation-image">
                        </a>
                        <div class="animations-captions">
                            Quinoa
                        </div>
                        <div class="animations-text-box">
                            A hungry monster
                        </div>
                    </div>
                    <div class="img-container">
                        <a href="https://google.com" target="_blank">
                            <img src="Icons/Rough_Morning.png" alt="Rough Morning" class="animation-image">
                        </a>
                        <div class="animations-captions">
                            Rough Morning
                        </div>
                        <div class="animations-text-box">
                            A woman having a bad hair day before leaving for work
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
</body>