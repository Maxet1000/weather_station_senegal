<script>
	import { Getuser, IsCityFromUserFavoriet, IsUserAdmin, RemoveCityFB, SetNewCity, addCityToFavorietUser, removeFromFavorieteUser } from './../fireBase.js';
    import { onMount } from 'svelte';
    import './SideBar.css';
    import { _, isLoading } from 'svelte-i18n';

    let plotly;

onMount(async () => {
  const module = await import('plotly.js-dist');
  plotly = module.default;
});
    var user;
    var userAdmin = false;
    var newCityOpen = false;
    var newCity = "";
    var eddit = false;
    export let citys;

    export let open;
    $:{ 
        open = open;
        if(open){
            handleSideBarOpen();
        }
    };

    async function handleSideBarOpen(){
        user = await Getuser();
        if(user){
            favoriete = JSON.parse(localStorage.getItem('favoriete'));
            citys = [...favoriete, ...citys.filter(city => !favoriete.includes(city))];
            userAdmin = await IsUserAdmin();
        }
    }

    export let selectedCity;
    var tempSelectedCity;
    var favoriete = [];
    $: {
        favoriete = favoriete;
        citys = [...favoriete, ...citys.filter(city => !favoriete.includes(city))];
    };

    function handleClickCard(element){
        tempSelectedCity = element;
    }

    function handleClickSpecifique(element){
        open = !open;
        selectedCity = element;
        localStorage.setItem('selectedCity', selectedCity);
    }

    async function removeFromFavoriete(uid, city){
        var tempFav = [];
        favoriete.forEach(element => {
            if(element != city){
                tempFav.push(element);
            }
        });
        favoriete = tempFav;
        localStorage.setItem('favoriete', JSON.stringify(favoriete));
        await removeFromFavorieteUser(uid, city);
    }

    async function addCityToFavoriet(uid, city){
        var alreadyFav = false;
        favoriete.forEach(element => {
            if(element == city){
                alreadyFav = true;
            }
        });
        if(!alreadyFav){
            favoriete.push(city);
            favoriete = favoriete;
            localStorage.setItem('favoriete', JSON.stringify(favoriete));
            await addCityToFavorietUser(uid, city);
        }
    }

    function handelNewCityClick(){
        newCityOpen = !newCityOpen;
    }

    function addCity(city){
        if(city&&!citys.includes(city)){
            citys.push(city);
            newCity = "";
            newCityOpen = false;
            citys = citys;
            SetNewCity(city);
        }
        else{
            alert($_('city already exists or empty'));
        }
    }

    function handelEditClick(){
        eddit = !eddit;
    }

    function removeCity(city){
        if(confirm("Are you sure you want to remove this city?")){
            var tempCitys = [];
            citys.forEach(element => {
                if(element != city){
                    tempCitys.push(element);
                }
            });

            var tempFav = [];
            favoriete.forEach(element => {
                if(element != city){
                    tempFav.push(element);
                }
            });

            citys = tempCitys;
            favoriete = tempFav;
            localStorage.setItem('favoriete', JSON.stringify(favoriete));
            RemoveCityFB(city);
        }
    }

</script>

<div class="sideBar" class:open>
    {#if !$isLoading}
        {#each citys as element}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class="cardElement">
                    <div class="mainCardElement {element == tempSelectedCity? "selected":"cardHover"}">
                        {#if user}
                            {#if  favoriete.includes(element)}
                                <i on:click={() => removeFromFavoriete(user.uid,element)} class="fa-solid fa-star fa-xl" style="color: #FFD43B;"></i>
                            {:else}
                                <i on:click={() => addCityToFavoriet(user.uid,element)} class="fa-regular fa-star fa-xl" style="color: #000000;"></i>
                            {/if}
                        {/if}
                        <h3 on:click={() => {handleClickCard(element)}}>
                            {element}
                        </h3>
                        {#if eddit}
                            <i on:click={() => {removeCity(element)}} class="fa-solid fa-trash fa-xl padding:10px" style="color: red;"></i>
                        {/if}
                    </div>

                    <div class="city" class:openCity={element == tempSelectedCity}>
                        <a href="/stationInfo" style="text-decoration: none; color: black;" on:click={() => {handleClickSpecifique(element)}}>
                            <h4>{$_('station info')}</h4>
                        </a>
                        <a href="/seasonInfo" style="text-decoration: none; color: black;" on:click={() => {handleClickSpecifique(element)}}>
                            <h4>{$_('season info')}</h4>
                        </a>
                    </div>
                </div>
        {/each}
        {#if eddit}
            <div class="createNewCity">
                {#if !newCityOpen}
                    <i on:click={() => handelNewCityClick()} class="fa-solid fa-plus fa-xl" style="color: gray; padding: 30px"></i>
                {:else}
                    <input type="text" placeholder={$_('new city')} bind:value={newCity}>
                    <div style="display: flex; flex-direction: row;">
                        <button style="background-color: rgb(87, 255, 87);" on:click={() => addCity(newCity)}>{$_('add')}</button>
                        <button style="background-color: rgb(255, 48, 48);" on:click={() => handelNewCityClick()}>{$_('stop')}</button>
                    </div>
                {/if}
            </div>
        {/if}
        {#if userAdmin && user}
            <div style="width: 100%; display: flex; flex-direction: row; justify-content: center; margin-bottom: 20px; padding-top: 20px;">
                <a href="/admin">
                    <i class="fa-solid fa-cog fa-xl" style="position: relative;"></i>
                </a>
                <a  on:click={() => handelEditClick()}>
                    <i class="fa-solid fa-pen fa-xl" style="margin-left: 10px; margin-top:5px;"></i>
                </a>
            </div>
        {/if}
    {/if}
</div>