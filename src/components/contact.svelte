<style>
    .body-contact {
        font-family: Arial, sans-serif;
    }
    .h1-contact {
        padding: 0px;
        margin: 0px;
        font-size: 75px;
    }
    .container-contact {
        max-width: 100%;
        max-height: 100vh;
        margin: 0 auto;
        padding: 20px;
        display: flex;
    }
    .left-column {
        flex: 1;
        padding: 10px;
    }
    .right-column {
        flex: 1;
        padding: 10px;
    }
    .img-contact {
        max-width: 70%;
        height: auto;
    }
    input, textarea {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
    }
</style>
<body class="body-contact">
    
    <div class="container-contact">
        <div class="left-column">
            <img src="Icons/ClairePortrait.png" alt="pic of me" class="img-contact">
        </div>
        <div class="right-column">
            <h1 class="h1-contact">Contact Me</h1>
            <form action="contactform.py" method="post">
                <label for="name">Name:</label>
                <input type="text" id="name" name="name" required><br>
                <label for="email">Email:</label>
                <input type="email" id="email" name="email" required><br>
                <label for="message">Message:</label>
                <textarea id="message" name="message" rows="4" required></textarea><br>
                <input type="submit" value="Submit">
            </form>
        </div>
    </div>
</body>
