<template lang="pug">
.d-flex.flex-column.flex-md-row.justify-content-between.align-items-center
    .info.mb-1.d-flex(v-if='numElems > 0')
        span Showing {{ start }} to {{ end }} of {{ numElems }}
        .page-size.d-flex
            label.ms-3.text-muted.small(for='page-size') Display:
            select#page-size.ms-2.form-select.form-select-sm.py-0.text-muted(v-model='pageSize')
                option(value='10') 10
                option(value='25') 25
                option(value='50') 50
                option(value='100') 100

    .info.mb-1(v-else) No entries

    nav.paging_simple_numbers(v-if='pNumPages > 1', aria='Page navigation')
        ul.pagination.flex-wrap.mb-0(v-if='pNumPages < 10')
            li.page-item(@click='setPage(0, -1)', :class='{ disabled: !hasPrev }')
                a.page-link &laquo;
            li.page-item(v-for='idx in pNumPages', :key='idx', @click='setPage(idx - 1)', :class='{ active: idx == currPage + 1 }')
                a.page-link {{ idx }}
            li.page-item(@click='setPage(0, 1)', :class='{ disabled: !hasNext }')
                a.page-link &raquo;
        ul.pagination.flex-wrap.mb-0(v-if='pNumPages >= 10 && currPage > 4 && currPage < pNumPages - 3')
            li.page-item(@click='setPage(0, -1)', :class='{ disabled: !hasPrev }')
                a.page-link &laquo;
            li.page-item(@click='setPage(0, 0)', :class='{ active: currPage == 0 }')
                a.page-link 1
            li.page-item
                a.page-link ...
            //- Pongo la página actual y dos más para atrás/adelante
            li.page-item(v-for='idx in [-2, -1, 0, 1, 2]', :key='idx', @click='setPage(currPage + idx)', :class='{ active: idx == 0 }')
                a.page-link {{ currPage + idx + 1 }}

            li.page-item
                a.page-link ...
            li.page-item(@click='setPage(pNumPages - 1, 0)')
                a.page-link {{ pNumPages }}
            li.page-item(@click='setPage(0, 1)', :class='{ disabled: !hasNext }')
                a.page-link &raquo;

        ul.pagination.flex-wrap.mb-0(v-if='pNumPages >= 10 && currPage <= 4', aria='Page navigation')
            li.page-item(@click='setPage(0, -1)', :class='{ disabled: !hasPrev }')
                a.page-link &laquo;
            li.page-item(@click='setPage(0, 0)', :class='{ active: currPage == 0 }')
                a.page-link 1
            li.page-item(v-for='idx in [1, 2, 3, 4, 5]', :key='idx', @click='setPage(idx)', :class='{ active: idx == currPage }')
                a.page-link {{ idx + 1 }}

            li.page-item
                a.page-link ...
            li.page-item(@click='setPage(pNumPages - 1, 0)')
                a.page-link {{ pNumPages }}
            li.page-item(@click='setPage(0, 1)', :class='{ disabled: !hasNext }')
                a.page-link &raquo;

        ul.pagination.flex-wrap.mb-0(v-if='pNumPages >= 10 && currPage >= pNumPages - 3')
            li.page-item(@click='setPage(0, -1)', :class='{ disabled: !hasPrev }')
                a.page-link &laquo;
            li.page-item(@click='setPage(0, 0)')
                a.page-link 1
            li.page-item
                a.page-link ...

            li.page-item(
                v-for='idx in [3, 2, 1, 0]',
                :key='idx',
                @click='setPage(pNumPages - idx - 1)',
                :class='{ active: pNumPages - idx - 1 == currPage }')
                a.page-link {{ pNumPages - idx }}
            li.page-item(@click='setPage(0, 1)', :class='{ disabled: !hasNext }')
                a.page-link &raquo;
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';

export type Pagination = {
    size: number;
    offset: number;
    page: number;
};

const props = defineProps({
    numElems: { type: Number, default: 0 },
    size: { type: Number, default: 10 }
});

const emit = defineEmits<{
    (event: 'change', value: Pagination): void;
}>();

const pageSize = ref(props.size);
const pNumPages = ref(0);
const currPage = ref(0);

const start = computed(() => {
    return currPage.value * pageSize.value + 1;
});
const end = computed(() => {
    const pEnd = pageSize.value * (currPage.value + 1);
    return Math.min(pEnd, props.numElems);
});
const hasPrev = computed(() => {
    return currPage.value > 0;
});
const hasNext = computed(() => {
    return currPage.value < pNumPages.value - 1;
});

function prepareValues(): void {
    if (pageSize.value < 3) pageSize.value = 3;
    pNumPages.value = Math.ceil(props.numElems / pageSize.value);
}
function setPage(nPag: number, offset?: number): void {
    if (offset) nPag = currPage.value + offset;
    if (nPag < 0) nPag = 0;
    if (nPag > 0 && nPag >= pNumPages.value) nPag = pNumPages.value - 1;
    currPage.value = nPag;
    // Notify action
    emit('change', { size: pageSize.value, offset: start.value - 1, page: currPage.value });
}

watch(pageSize, (val) => {
    if (typeof val === 'string') pageSize.value = val;
    prepareValues();
    setPage(currPage.value, 0);
});
watch(
    () => props.numElems,
    () => {
        prepareValues();
        setPage(currPage.value, 0);
    }
);

onBeforeMount(() => {
    prepareValues();
    setPage(0);
});
</script>
