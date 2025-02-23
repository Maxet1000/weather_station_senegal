<script>
    import { onMount } from 'svelte';
    import './Header.css'

    export let open;
    export let selectedCity;

    function  handleHomeclick(){
        selectedCity = "Senegal";
        open = false;
        localStorage.setItem('selectedCity', null);
    }

    onMount(() => {
        if(localStorage.getItem('selectedCity')){
            selectedCity = localStorage.getItem('selectedCity');
        }
    });
</script>

<div class="header">
    <div class="menuOption">
        {#if open}
            <i on:click={() => {open =! open;}} class="fa-solid fa-arrow-left"></i>
        {:else}
            <i on:click={() => {open =! open;}} class="fa-solid fa-bars"></i>        
        {/if}
        <h2 on:click={() => {open =! open;}}>{selectedCity}</h2>
    </div>
    <div>
        <a href="/" on:click={() => handleHomeclick()}>
            <i class="fa-solid fa-home" style="color: black; left: -10px; position: relative; padding-right: 20px"></i>
        </a>
        <a href="/crops" on:click={() => handleHomeclick()}>
            <i class="fa-solid fa-solid fa-seedling" style="color: black; left: -10px; position: relative; padding-right: 20px"></i>
        </a>
        <a href="/login" on:click={() => handleHomeclick()}>
            <i class="fa-solid fa-right-to-bracket" style="color: black; left: -10px; position: relative; padding-right: 20px"></i>
        </a>
    </div>
</div>