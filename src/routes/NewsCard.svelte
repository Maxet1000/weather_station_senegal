<script>
    import { onMount } from "svelte";
    import { RemoveNews, UpdateNews, getNewsImage } from "../fireBase";
    import "./newsCard.css"
    export let news;
    export let admin;
    
    var edetedNews ={
        title: news.title,
        mainBlob: news.mainBlob,
        img: news.img,
        date: news.date,
        location: news.location, 
        id: news.id
    };
    
    var colors = ["#cc5d51", "#b551cc", "#51cc55", "#51ccab"];
    var module = news.elementNumber % colors.length;
    var edit = false;
    var innerWidth;
    var image;
    $:image = image;

    onMount(async () => {
        handleImageLoad();
    });

    async function handleImageLoad(){
        if(localStorage.getItem(news.img)){
            image = localStorage.getItem(news.img);
        }
        else{
            image = await getNewsImage(news.img);
            localStorage.setItem(news.img, image);
        }
    }

    function formatDate(date){
        var d = new Date(date.seconds * 1000);
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hour = d.getHours();
        var min = d.getMinutes();
        return " " + day + "-" + month + "-" + year + " " + hour + ":" + min + "  ";
    }

    function onEditClick(){
        edit = !edit;
        edetedNews ={
            elementNumber: news.elementNumber,
            title: news.title,
            mainBlob: news.mainBlob,
            img: news.img,
            date: news.date,
            location: news.location,
            id: news.id
        };
    }

    function handleUpdateClick(){
        edit =! edit;
        if(news != edetedNews){
            news = edetedNews;
            handleImageLoad(news.img);
            UpdateNews(edetedNews);
        }
    }

    function handleDelteClick(){
        if(confirm("Are you sure you want to delete this news?")){
            RemoveNews(news);
        }
    }

</script>

<svelte:window bind:innerWidth={innerWidth}/>

<newscard class="newscard" style="background: {colors.at(module)}; color: white">
    {#if news.elementNumber % 2 == 0 || innerWidth < 700}
        {#if image}
            <img src={image} alt="somthing went wrong">
        {:else}
            <img src="./src/images/imageNotFound.jpg.png">
        {/if}
    {/if}
    <div class="newsText">
        <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
            {#if edit}
                <input type="text" bind:value={edetedNews.title}>
            {:else}
                <h1>{news.title}</h1>
            {/if}
            {#if admin}
                <i on:click={() => onEditClick()} class="fa-solid fa-pen fa-xl pressable"></i>
            {/if}
        </div>
        <div class="moreInfo">
            <i class="fa-solid fa-clock" style="color: black; padding: 0px 5px 5px 5px"></i>
            <p>{formatDate(news.date)}</p> 
            <i class="fa-solid fa-location-dot" style="color: black; padding: 0px 5px 5px 5px"></i>
            <p>{news.location}</p>
        </div>
        {#if edit}
            <textarea bind:value={edetedNews.mainBlob}></textarea>
            <div style="display: flex; display: flex; justify-content: center;">
                <button style="background-color: rgb(87, 255, 87);" on:click={() => handleUpdateClick()}>Save</button>
                <button style="background-color: rgb(255, 48, 48);" on:click={() => handleDelteClick()}>Delete</button>
            </div>
        {:else}
            <p class="maintext">{news.mainBlob}</p>
        {/if}
    </div>
    {#if news.elementNumber % 2 == 1 && innerWidth > 700}
        {#if image}
            <img src={image}>
        {:else}
            <img src={"./src/images/imageNotFound.jpg.png"}>
        {/if}
    {/if}
</newscard>
