<script>
  import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from 'sveltestrap';
    import { onMount } from 'svelte';

  let isOpen = false;
  let isScrolled = false;
  const toggle = () => (isOpen = !isOpen);

  onMount(() => {
      const handleScroll = () => {
          isScrolled = window.scrollY > 0;
          console.log("Is Scrolled:", isScrolled); // Logging the scroll status 
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  });

  // Close the navbar when a link is clicked
  const closeNavbar = () => {
    isOpen = false;
  };
</script>

<Navbar style="{isScrolled || isOpen? 'background-color: #848B79;' : 'background-color: transparent;'} position: sticky; top: 0; z-index: 1020;">
  <NavbarBrand href="#Top-Page" on:click={closeNavbar} style="color: #000000; font-size: 40px; font-family: Amarante" class="me-auto">Claire Hanel</NavbarBrand>
  <NavbarToggler on:click={toggle} class="me-2" style="color: black"/>
  <Collapse {isOpen} navbar style="transition: 0.75s ease;">
    <Nav navbar>
      <NavItem>
        <NavLink href="#About-Me" on:click={closeNavbar} style="color: #000000; font-size: 20px; font-family: Catamaran">About Me</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#Animations" on:click={closeNavbar} style="color: #000000; font-size: 20px; font-family: Catamaran">Animations</NavLink>
      </NavItem>
      <NavItem>
          <NavLink href="#Artwork" on:click={closeNavbar} style="color: #000000; font-size: 20px; font-family: Catamaran">Artwork</NavLink>
      </NavItem>
      <NavItem>
        <NavLink href="#Contact" on:click={closeNavbar} style="color: #000000; font-size: 20px; font-family: Catamaran">Contact</NavLink>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>
