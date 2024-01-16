<style>
    .body-profile {
        font-family: Arial, sans-serif;
        background-color: #CBC3E3;
        margin: 0;
        padding: 0;
        max-width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .h1-profile {
        font-size: 50px;
        margin: 0;
        padding: 0;
    }

    .container-profile {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .profile-content {
        background-color: #CBC3E3;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        margin-left: 2.5%;
        margin-right: 40%;
        padding: 1%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .profile-image {
        width: 600px;
        height: auto;
        margin-left: 0;
    }

    .about-me {
        flex-grow: 1;
        font-size: 16px;
        line-height: 1.6;
        margin-left: 1%;
        margin-right: 2%;
    }
</style>

<body class="body-profile" style="background-image: url('Icons/totoro_banner.jpg'); background-attachment: fixed; background-size: 100% 100%; background-repeat: no-repeat;">
    <div class="container-profile">
        <div class="profile-content">
            <img src="Icons/ClairePortrait.png" alt="Portrait of Claire" class="profile-image">
            <div class="about-me">
                <h1 class="h1-profile">About Me</h1>
                <p>Hello, I'm Claire. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae neque
                    ac justo malesuada luctus. Nullam eleifend, justo at viverra tristique, dui sapien volutpat
                    nisi, et volutpat libero justo a nisl. Fusce id quam ac nisi finibus volutpat. Curabitur
                    auctor felis non velit auctor tincidunt.</p>
                <!-- Add more content about yourself as needed -->
            </div>
        </div>
    </div>
</body>


