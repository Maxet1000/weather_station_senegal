<script>
	import { ForgotPassword, LoginUser, LogoutUser, RegisterUser, Getuser} from './../../fireBase.js';
    import './page.css'
    import { onMount } from 'svelte';
    import {goto} from '$app/navigation';
    import { _, isLoading } from 'svelte-i18n';

    var email;

    var password;
    var secondPassword;

    var innerWidth;

    var showPassword = false;
    var showSecondPassword = false;

    var passwordsDontMatch = false;

    var forgotPassword = false;
    var signUp = false;

    var user;

    onMount(async () => {
        user = await Getuser();
    });

    //on loggin load favorites citys into memory

    async function checkLoggin() {
        var succeed = false;
        if (forgotPassword) {
            succeed = await ForgotPassword(email);
            if(succeed) {
                goto("/");
            }
        } else if (signUp) {
            if (password === secondPassword && password.length > 7) {
                passwordsDontMatch = false;
                user = await RegisterUser(email, password);
                if(user) {
                    goto("/");
                }
            } 
            else if (password.length < 8){
                //maak dit nog mooier alert is neit mooi!!
                alert($_('password must be at least 8 characters long'));
            }
            else {
                passwordsDontMatch = true;
            }
        } else {
            user = await LoginUser(email, password);
            if(user) {
                goto("/");
            }
        }
    }

    function handleSignupClick() {
        signUp = !signUp;
        forgotPassword = false;
    }

    function handleForgotPasswordClick() {
        forgotPassword = !forgotPassword;
        signUp = false;
    }

    function handleGoBack() {
        forgotPassword = false;
        signUp = false;
    }

    function handleIconClick(){
        withEmail = !withEmail;
    }

    function handleLogoutClick() {
        LogoutUser();
        user = null;
        email = "";
        password = "";
    }

</script>

<svelte:window bind:innerWidth={innerWidth}/>

<div class="loggin">
    {#if $isLoading}
        <h3>loading...</h3>
    {:else}
        <img src="../src/images/loginPage.png">
        {#if !user}
            <form action="">
                <div style="display: flex; flex-direction: row; align-items:center ;">
                    <i on:click={() => handleIconClick()} class="fa-solid fa-envelope fa-2xl" style="color: #000000;"></i>
                    <input type="email" placeholder={$_('email')} bind:value={email} required>
                    {#if innerWidth > 700}
                        <div style="width: 30px;"></div>
                    {/if}
                </div>
                {#if !forgotPassword}
                    <div class="passwordDiv" style="display: flex; flex-direction: row; align-items:center ;">
                        {#if innerWidth > 700}
                            <div style="width: 30px;"></div>
                        {/if}
                        {#if showPassword}
                            <input type="text" style={passwordsDontMatch? "color: red; border-color: red;": ""} placeholder={$_('password')} bind:value={password} required>
                            <i class="fa-solid fa-eye-slash fa-2xl" style="color: #000000;" on:click={() => {showPassword = !showPassword}}></i>
                        {:else}
                            <input type="password" style={passwordsDontMatch? "color: red; border-color: red;": ""} placeholder={$_('password')} bind:value={password} required>
                            <i class="fa-solid fa-eye fa-2xl" style="color: #000000;" on:click={() => {showPassword = !showPassword}}></i>
                        {/if}
                    </div>
                {/if}
                
                {#if signUp}
                    <div class="passwordDiv" style="display: flex; flex-direction: row; align-items:center ;">
                        {#if innerWidth > 700}
                            <div style="width: 30px;"></div>
                        {/if}
                        {#if showSecondPassword}
                            <input type="text" style={passwordsDontMatch? "color: red; border-color: red;": ""} placeholder={$_('password')} bind:value={secondPassword} required>
                            <i class="fa-solid fa-eye-slash fa-2xl" style="color: #000000;" on:click={() => {showSecondPassword = !showSecondPassword}}></i>
                        {:else}
                            <input type="password" style={passwordsDontMatch? "color: red; border-color: red;": ""} placeholder={$_('password')} bind:value={secondPassword} required>
                            <i class="fa-solid fa-eye fa-2xl" style="color: #000000;" on:click={() => {showSecondPassword = !showSecondPassword}}></i>
                        {/if}
                    </div>
                {/if}

                {#if signUp}
                    <input type="submit" value={$_('sign up')} style="width: 100px;" on:click={() =>  checkLoggin()}>
                {:else if forgotPassword}
                    <input type="submit" value={$_('Forgot password')} on:click={() =>  checkLoggin()}>
                {:else}
                    <input type="submit" value={$_('login')} style="width: 100px;" on:click={() =>  checkLoggin()}>
                {/if}
            </form>
            <div class="signUp">
                <h4> 
                    {#if signUp || forgotPassword}
                        <button on:click={() => handleGoBack()}> {$_('go back')} </button> 
                    {:else}
                        <button on:click={() => handleSignupClick()}> {$_('sign up')} </button> 
                        {$_('or')} 
                        <button on:click={() => handleForgotPasswordClick()}> {$_('forgot password')} </button>
                    {/if}
                </h4>
            </div>
        {:else}
            <h3>{$_('you are already loged in')}</h3>
            <input type="submit" value={$_('logout')} style="width: 100px;" on:click={() =>  handleLogoutClick()}>
        {/if}
    {/if}
</div>