module.exports = {
    vueTemplate:componentName => {
        return `<template>
    <div class="${componentName}">
        ${componentName}组件
</div>
</template>
<script>
export default {
    name:'${componentName}',
    data () {
        return{

        }
    },
    created(){

    },
    methods:{

    }
}
</script>
<style lang="less" scoped>
.${componentName}{

}
</style>`
}
}