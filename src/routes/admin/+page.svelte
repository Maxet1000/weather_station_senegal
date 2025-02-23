<script>
	import { _, isLoading } from 'svelte-i18n';
    import { onMount } from 'svelte';
	import { GetAllUsers, IsUserAdmin, SetUserAdmin } from './../../fireBase.js';
    import './page.css';
    var users = [];

    onMount(async () => {
        users = await GetAllUsers();
    });

    //nog altijd error soms voor sommige users
    function handleAdminChange(event, user) {
        if(event.target.value === 'true' && !user.userData.admin) {
            SetUserAdmin(user,true);
        } 
        else if(user.userData.admin){
            SetUserAdmin(user,false);
        }
    }   

</script>

<div class="main">
    {#if $isLoading}
        <p>Loading...</p>
    {:else}
        <h1>Admin</h1>
        <div class="mainAdmin">
            <div class="adminHeader">
                <h3 class="email">{$_('email')}</h3>
                <h3 class="admin">{$_('admin')}</h3>
            </div>   
            
            {#each users as user}
                <div class="adminRow">
                    <p class="email">{user.userData.email}</p>
                    <select name="admin" on:change={(event) => handleAdminChange(event, user)}>
                        <option value="true" selected={user.userData.admin}>{$_('true')}</option>
                        <option value="false" selected={!user.userData.admin}>{$_('false')}</option>
                    </select>
                </div>
            {/each}
        </div>
    {/if}
</div>