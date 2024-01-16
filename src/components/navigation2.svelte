<script>
    import { onMount } from 'svelte';

    let isOpen = false;
    let isVisable = false;
    let isScrolled = false;
    let scrollTimeout;

    // Function to toggle the navbar open/closed
    function toggle() {
        isOpen = !isOpen;
    }

    onMount(() => {
        function handleScroll() {
            isVisable = window.scrollY > 0;
            clearTimeout(scrollTimeout);
            isScrolled = true;

            // Set a timeout to change isScrolled to false after a delay of 200ms
            if (isScrolled) {
                // while scrolling, close and hide navbar
                isVisable = false;
                isOpen = false;
                // change status of isScrolled after 200ms, make navbar visible again if not at the top of the page
                scrollTimeout = setTimeout(() => {
                    isScrolled = false;
                    isVisable = window.scrollY > 0;
                }, 200);
            }
        }

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    // Function to close the navbar
    function closeNavbar() {
        isOpen = false;
    }
</script>
<style>
    /* Add some basic styling to the navigation bar */
    .navbar {
        position: fixed;
        top: 0;
        z-index: 1020;
        display: flex;
        align-items: center;
        padding: 10px;
        width: 100%;
        padding-right: 20px;

        transition: background-color 0.6s ease; /* Add transition for background-color */
    }

    .navbar-brand {
        color: #000000;
        font-size: 40px;
        font-family: 'Amarante';
        margin-left: 0.5%;
    }

    .navbar-toggler {
        color: black;
        cursor: pointer;
        height: 50px;
        width: 50px;
        font-size: 24px; /* Adjust the font size as needed */

        display: flex; /* Make it a flex container */
        justify-content: center; /* Center children horizontally */
        align-items: center; /* Center children vertically */

        border: 2px solid #000000; /* Heavier border: width, style, color */
        border-radius: 10px; /* Make the corners slightly rounded */

        transition: background-color 0.4s ease;
    }

    .navbar-toggler:hover, .navbar-toggler:focus {
        background-color: white;
        outline: none;
    }

    .toggler-img {
        height: 30px;
        width: 30px;

        transition: transform 0.3s ease;
    }

    .transformed-toggler-img {
        transform: rotate(180deg) scale(1.25);
    }

    .nav-items {
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
        justify-content: center; /* Center items horizontally */
        align-items: center; /* Align the items vertically */
        margin-right: 10px;

        transform: translateX(50%) scale(0); /* Initially, move the nav-items to the right */
        transition: transform 0.6s ease, opacity 0.6s ease,  visibility 0s linear 0.35s; /* Transition effect for sliding and fading in */
        visibility: hidden; /* Start hidden */
        opacity: 0;
    }

    .nav-items-visible {
        transform: translateX(0) scale(1); /* Move nav-items back to original position when visible */
        transition: transform 0.6s ease, opacity 0.6s ease;
        visibility: visible;
        opacity: 1;
    }

    .nav-group {
        display: flex;
        margin-right: 0.5%;
    }

    .nav-item {
        margin: 0 15px;
    }

    .nav-link {
        color: #000000;
        font-size: 20px;
        font-family: 'Catamaran';
        text-decoration: none;
        transition: font-size 0.4s ease;
    }

    .nav-link:hover {
        text-decoration: underline;
        font-size: 23px;
    }
</style>

<nav class="navbar" id="navbar" style="{isOpen || isVisable ? 'background-color: #848B79;' : 'background-color: transparent;'}">
    <a class="navbar-brand" href="#Top-Page">Claire Hanel</a>
    <div class="nav-group">
        <ul class="nav-items {isOpen ? 'nav-items-visible' : ''}" id="nav-items">
            <li class="nav-item"><a class="nav-link" href="#About-Me" on:click={closeNavbar}>About Me</a></li>
            <li class="nav-item"><a class="nav-link" href="#Animations" on:click={closeNavbar}>Animations</a></li>
            <li class="nav-item"><a class="nav-link" href="#Artwork" on:click={closeNavbar}>Artwork</a></li>
            <li class="nav-item"><a class="nav-link" href="#Contact" on:click={closeNavbar}>Contact</a></li>
        </ul>
        <div class="navbar-toggler" on:click={toggle} id="navbar-toggler">
            <img src={isOpen ? 'Icons/x_icon.png' : 'Icons/paint_brush.png'} class="toggler-img {isOpen ? 'transformed-toggler-img' : ''}" alt="Toggler Icon">
        </div>
    </div>
</nav>