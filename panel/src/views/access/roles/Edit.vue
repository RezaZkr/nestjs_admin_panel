<script setup>
import { onBeforeMount, reactive, ref } from 'vue';
import axios, { HttpStatusCode } from 'axios';
import { useRoute } from 'vue-router';

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
// const router = useRouter();

const loading = ref(false);
const groupedPermissions = reactive({});
const formData = reactive({
    name: null,
    permissions: []
});

const formDataErrors = reactive({
    name: [],
    permissions: []
});

/////////////////////////////////////////////////////////////Variables////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////Methods////////////////////////////////////////////////////////////////

const fetchData = async () => {
    loading.value = true;
    try {
        const response = await axios.get('roles/' + route.params.id);
        await fillFormData(response.data);
    } catch (error) {
        console.log('error');
        console.log(error);
        console.log('error');
    } finally {
        loading.value = false;
    }
};

const fillFormData = async (data) => {
    formData.name = data.name;
    formData.permissions = data.permissions.map((permission) => permission.permission_id);
};

const fetchPermissions = async () => {
    loading.value = true;
    try {
        const response = await axios.get('permissions', {
            params: {
                take: 100
            }
        });
        await groupPermissions(response.data.data);
    } catch (error) {
        console.log('error');
        console.log(error);
        console.log('error');
    } finally {
        loading.value = false;
    }
};

const groupPermissions = async (permissions) => {
    for (const permission of permissions) {
        if (!groupedPermissions[permission.group]) {
            groupedPermissions[permission.group] = [];
        }

        await groupedPermissions[permission.group].push(permission);
    }

};

const update = async () => {
    loading.value = true;
    formDataErrors.name = [];
    formDataErrors.permissions = [];
    try {
        const response = await axios.post('roles/' + route.params.id, formData);

    } catch (error) {
        if (error.status === HttpStatusCode.BadRequest) {
            Object.assign(formDataErrors, error.response.data);
        }
    } finally {
        loading.value = false;
    }
};

const getGroupIds = (groupKey) => groupedPermissions[groupKey].map((perm) => perm.id);

const isGroupIndeterminate = (groupKey) => {
    const ids = getGroupIds(groupKey);
    const selected = ids.filter((id) => formData.permissions.includes(id));
    return selected.length > 0 && selected.length < ids.length;
};

const isGroupSelected = (groupKey) => {
    const ids = getGroupIds(groupKey);
    return ids.every((id) => formData.permissions.includes(id));
};

const toggleSelectAll = (groupKey, checked) => {
    const ids = getGroupIds(groupKey);
    if (checked) {
        const unique = new Set([...formData.permissions, ...ids]);
        formData.permissions = Array.from(unique);
    } else {
        formData.permissions = formData.permissions.filter((id) => !ids.includes(id));
    }
};

/////////////////////////////////////////////////////////////Methods////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////Other////////////////////////////////////////////////////////////////

onBeforeMount(async () => {
    await fetchData();
    await fetchPermissions();
});

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

            <div class="card flex flex-col w-full">
                <div class="font-semibold text-xl">Edit</div>

                <div class="flex flex-col md:flex-row">
                    <div class="md:w-1/2">
                        <div class="card flex flex-col">
                            <div class="flex flex-col gap-2">
                                <label for="name1">Role Name</label>
                                <InputText id="name" type="text" v-model="formData.name" />
                                <small class="text-red-500" v-if="formDataErrors.name.length">
                                    {{ formDataErrors.name[0] }}
                                </small>
                            </div>
                        </div>
                    </div>

                    <div class="md:w-1/2">
                        <div class="card flex flex-col">
                            <div class="flex flex-col gap-2 pt-6">
                                <Button label="Update" severity="success" raised @click="update()" />
                            </div>
                        </div>
                    </div>
                </div>

                <Divider align="left" type="solid" class="font-semibold text-xl">
                    <b>Permissions</b>
                </Divider>

                <small class="text-red-500 mb-2" v-if="formDataErrors.permissions.length">
                    {{ formDataErrors.permissions.join(' , ') }}
                </small>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card v-for="(group, index) in groupedPermissions" :key="index" class="h-full">
                        <template #header>
                            <span class="font-bold">{{ index }}</span>
                        </template>
                        <template #content>
                            <div class="flex flex-col gap-2">
                                <div v-for="permission in group" :key="permission.id" class="flex items-center gap-4">
                                    <Checkbox :inputId="'_' + permission.id" :name="index" :value="permission.id" v-model="formData.permissions" />
                                    <label :for="'_' + permission.id">{{ permission.label }}</label>
                                </div>
                            </div>
                        </template>
                        <template #footer>
                            <Divider align="left" type="solid" />
                            <div class="flex gap-4">
                                <Checkbox :inputId="index + '_all'" :name="index" :modelValue="isGroupSelected(index)" :indeterminate="isGroupIndeterminate(index)" @update:modelValue="toggleSelectAll(index, $event)" binary />

                                <label :for="index + '_all'">Select all</label>
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
        </div>
    </Fluid>
</template>
