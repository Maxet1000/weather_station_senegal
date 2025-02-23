<script>
    import "./homePage.css"
    import { afterNavigate } from '$app/navigation';
    import NewScard from "./NewsCard.svelte";
    import { GetCity, GetFavoriteFromUser, Getuser, IsUserAdmin, addNewsForCity, getNewsForCity, uploadNewsAndFoto } from "../fireBase";
    import { _, isLoading } from 'svelte-i18n';


    var newsElemnts = [];
    $: newsElemnts = newsElemnts;

    var admin = false;
    var openAddCard = false;
    var PictureFile;
    var fileName;
    var selectedFoto;
    var citys = [];
    var newNews = {
        title: "",
        mainBlob: "",
        img: "",
        date: "",
        location: ""
    }

    afterNavigate(async () => {
        handleNavigate();
        citys = await GetCity();
    });

    async function handleNavigate(){
        newsElemnts = [];
        var user = await Getuser();
        admin = await IsUserAdmin();
        var favorietUser = [];

        if(user && localStorage.getItem('favoriete')){
            favorietUser = JSON.parse(localStorage.getItem('favoriete'));
        }
        else{
            favorietUser = await GetFavoriteFromUser(user.uid);
        }

        if(!admin){
            favorietUser.forEach(async (element) => {
                const news = await getNewsForCity(element);
                if(news.length > 0){
                    newsElemnts.push(...news);
                }
                if(newsElemnts.length > 0){
                    newsElemnts.forEach((element, index) => {
                        element.elementNumber = index;
                    });
                }
                newsElemnts = newsElemnts;
            });
        }
        else{
            citys.forEach(async (element) => {
                await getNewsForCity(element).then((news) => {
                    if(news.length > 0){
                        newsElemnts.push(...news);
                    }
                    if(newsElemnts.length > 0){
                        newsElemnts.forEach((element, index) => {
                            element.elementNumber = index;
                        });
                    }
                    newsElemnts = newsElemnts;
                });
            });
        }
    }

    const handleFoto = (e) => {
        if(e.target.files && e.target.files.length > 0){
            PictureFile = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload =  t => {
                selectedFoto = t.target.result;
                fileName = e.target.files[0].name;
            }
        }
    } 

    function handleCityChange(event){
        newNews.location = event.target.value;
    }

    function handleNewCardKlick(){
        openAddCard = !openAddCard;
    }

    function handleAddNews(){
        newNews.date = new Date();
        if(fileName == "" || newNews.location === "" || newNews.mainBlob === "" || newNews.title === ""){
            alert($_('please fill all fields'));
            return;
        }
        uploadNewsAndFoto(PictureFile,fileName,newNews);
        newNews = {
            title: "",
            mainBlob: "",
            img: "",
            date: "",
            location: ""
        }
        openAddCard = !openAddCard;
    }
</script>

{#if $isLoading}
    <p> loading...</p>
{:else}
    <div class="mainHome">
        {#if admin}
            <div class="addNews">
                <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div style="width: 100%; text-align: center;" on:click={() => handleNewCardKlick()}>
                    <h1>{$_('add news')}</h1>
                </div>
                <div class="addNewsMain" class:openAddNews={openAddCard}>
                    <div class="addsecondMain">
                        <div class="imagePicer">
                            {#if selectedFoto}
                                <img src="{selectedFoto}"/>
                            {:else}
                                <img src="../src//images/404Senegalcropped.png"/>
                            {/if}
                            <input type="file" accept=".jpg, .jpeg, .png" on:change={(e) => handleFoto(e)}>
                        </div>
                        <div class="addNewsText">
                            <div class="titleDiv">
                                <input type="text" bind:value={newNews.title} required placeholder={$_('title')}>
                                <select on:change={(event) => handleCityChange(event)}>
                                    {#if citys.length == 0}
                                        <option value="no citys">{$_('noCity')}</option>
                                    {:else}
                                        {#each citys as city}
                                            <option value={city}>{city}</option>
                                        {/each}
                                    {/if}
                                </select>
                            </div>
                            <textarea bind:value={newNews.mainBlob} placeholder={$_('put home text here')}/>
                        </div>
                    </div>
                    <button on:click={() => handleAddNews()}>{$_('add news')}</button>
                </div>
            </div>
        {/if}
        {#if newsElemnts.length == 0}
            <h1>{$_('no news')}</h1>
            <h3 style="color: gray;">{$_('welcome')}</h3>
        {:else}
            {#each newsElemnts as newsItem}
                <NewScard news={newsItem} admin={admin}/>
            {/each}
        {/if}
    </div>
{/if}

