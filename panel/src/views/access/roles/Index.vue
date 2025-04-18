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
        label: 'Roles',
        route: 'access.roles'
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

const tableData = reactive({
    data: [],
    pagination: {
        current_page: 0,
        page_size: 0,
        total_count: 0,
        total_pages: 0,
        next_page: null,
        prev_page: null
    }
});

const pageUrl = computed(() => {
    let url = new URL(window.location.href);

    url.searchParams.delete('name');
    if (filter.name) {
        url.searchParams.set('name', filter.name);
    }

    url.searchParams.set('take', filter.take);
    url.searchParams.set('page', filter.page);
    window.history.replaceState({}, '', url);

    return 'roles' + url.search;
});
/////////////////////////////////////////////////////////////Variables////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////Methods////////////////////////////////////////////////////////////////

const fetchData = async () => {
    loading.value = true;
    try {
        const response = await axios.get(pageUrl.value);

        Object.assign(tableData, response.data);
    } catch (error) {
        console.log('error');
        console.log(error);
        console.log('error');
    } finally {
        loading.value = false;
    }
};

const edit = async (id) => {
    console.log('edit');
    console.log(id);
    console.log('edit');
    await router.push({ name: 'access.roles.edit', params: { id: id } });
};

const destroy = async (id) => {
    console.log('destroy');
    console.log(id);
    console.log('destroy');
};

const onPageChange = (event) => {
    filter.page = event.page + 1;
    filter.take = event.rows;
};

/////////////////////////////////////////////////////////////Methods////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////Other////////////////////////////////////////////////////////////////

onBeforeMount(() => {
    fetchData();
});

watch(
    () => pageUrl.value,
    debounce(() => {
        fetchData();
    }, 1000)
);

/////////////////////////////////////////////////////////////Other////////////////////////////////////////////////////////////////
</script>

<template>
    <Fluid>
        <div class="flex flex-col gap-6">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems">
                <template #item="{ item, props }">
                    <router-link v-if="item.route" v-slot="{ href, navigate }" :to="{ name: item.route }" custom>
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
                <div class="font-semibold text-xl">List</div>

                <DataTable
                    :value="tableData.data"
                    :loading="loading"
                    :rows="tableData.pagination.page_size"
                    :first="(filter.page - 1) * tableData.pagination.page_size"
                    :totalRecords="tableData.pagination.total_count"
                    :lazy="true"
                    @page="onPageChange"
                    paginator
                    removableSort
                    :rowsPerPageOptions="[10, 20, 50]"
                    tableStyle="min-width: 50rem"
                >
                    <template #header>
                        <div class="flex justify-end">
                            <IconField>
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText placeholder="Search ..." v-model="filter.name" />
                            </IconField>
                        </div>
                    </template>
                    <template #empty> No data found.</template>
                    <template #loading> Loading data. Please wait.</template>
                    <Column field="id" header="#" :sortable="true" style="width: 25%"></Column>
                    <Column field="name" header="Title" :sortable="true" style="width: 25%"></Column>
                    <Column header="Actions" style="width: 25%">
                        <template #body="slotProps">
                            <div class="flex gap-3">
                                <Button icon="pi pi-pencil" severity="info" rounded variant="text" @click="edit(slotProps.data.id)" />
                                <Button icon="pi pi-trash" severity="danger" rounded variant="text" @click="destroy(slotProps.data.id)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </Fluid>
</template>
