<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash-es';
import { useRoute, useRouter } from 'vue-router';


/////////////////////////////////////////////////////////////Variables////////////////////////////////////////////////////////////////
const breadcrumbHome = ref({
    icon: 'pi pi-home',
    route: 'dashboard'
});
const breadcrumbItems = ref([
    {
        label: 'Access'
    },
    {
        label: 'Roles'
    },
    {
        label: 'Edit',
        route: 'access.roles.edit'
    }
]);

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const filter = reactive({
    name: route.query.name ?? null,
    page: route.query.page ?? 1,
    take: route.query.take ?? 10
});

/////////////////////////////////////////////////////////////Variables////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////Methods////////////////////////////////////////////////////////////////

const fetchData = async () => {


    loading.value = true;
    try {
        const response = await axios.get('roles/' + route.params.id);

        //todo implement role create
        console.log('1111111111111111111111111111');
        console.log(response);
        console.log('1111111111111111111111111111');

    } catch (error) {
        console.log('error');
        console.log(error);
        console.log('error');
    } finally {
        loading.value = false;
    }
};

// const fetchData = async () => {
//
//     loading.value = true;
//     try {
//         const response = await axios.get(pageUrl.value);
//
//         Object.assign(tableData, response.data);
//
//     } catch (error) {
//         console.log('error');
//         console.log(error);
//         console.log('error');
//     } finally {
//         loading.value = false;
//     }
// };

/////////////////////////////////////////////////////////////Methods////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////Other////////////////////////////////////////////////////////////////

onBeforeMount(() => {
    fetchData();
    // fetchData();
});

/////////////////////////////////////////////////////////////Other////////////////////////////////////////////////////////////////
</script>

<template>
    <Fluid>
        <div class="flex flex-col gap-6">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems">
                <template #item="{ item, props }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="{name:item.route}" custom>
                        <a :href="href" v-bind="props.action" @click="navigate">
                            <span :class="[item.icon, 'text-color']" />
                            <span class="text-primary font-semibold">{{ item.label }}</span>
                        </a>
                    </router-link>
                    <a v-else href="#">
                        <span class="text-surface-700 dark:text-surface-0">{{ item.label }}</span>
                    </a>
                </template>
            </Breadcrumb>


            <div class="card flex flex-col gap-4 w-full">

                <div class="font-semibold text-xl">
                    Edit
                </div>

                gfh

            </div>
        </div>
    </Fluid>
</template>
