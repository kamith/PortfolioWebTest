<script>
    import Carousel from './components/carousel.svelte';
    import AboutMe from './components/selfPortrait.svelte';
    import Animations from './components/animations.svelte';
    import MyNav from './components/navigation.svelte';
    import Artwork from './components/artwork.svelte';
    import ContactMe from './components/contact.svelte';
    import Nav2 from './components/navigation2.svelte';
</script>

<style lang="scss">
    @import './styles/main.scss';
</style>

<main style="padding: 0em;">
    <Nav2></Nav2>
    <div id="Top-Page">
        <Carousel></Carousel>
    </div>
    
    <div id="About-Me" class="about">
        <AboutMe></AboutMe>
    </div>
    
    <div id="Animations">
        <Animations></Animations>
    </div>

    <div id="Artwork">
        <Artwork></Artwork>
    </div>

    <div id="Contact">
        <ContactMe></ContactMe>
    </div>
</main>

