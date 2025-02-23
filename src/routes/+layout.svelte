<script>
    import Header from './Header.svelte';
    import SideBar from './SideBar.svelte';
    import '@fortawesome/fontawesome-free/css/all.min.css'
    import './main.css'
    import { GetCity } from '../fireBase';
    import { onMount } from 'svelte';
    import '../lib/i18n.js'

    var cityName;

    var citys = [];

    onMount(async () => {
        citys = await GetCity();
        if(localStorage.getItem('selectedCity') != "null"){
            cityName = localStorage.getItem('selectedCity');
        }else{
            cityName = "Senegal";
        }
    });

    var open = false;
</script>

<Header bind:open={open} bind:selectedCity={cityName}/>
<div class="mainDiv">
    <SideBar bind:open={open} citys={citys} bind:selectedCity={cityName}/>
    <div style="width: 100%;">
        <slot/>
    </div>
</div>
