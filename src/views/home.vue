<template>
    <div class="grid-container">
        <div class="item item1">1</div>
        <div class="item item2">2</div>
        <div class="item item3">3</div>
        <div class="item item4">4</div>
        <div class="item item5">5</div>
        <div class="item item6">6</div>
    </div>
</template>

<script>
export default {
    
}
</script>

<style lang="less">
.grid-container{
    display: grid;
    padding: 20px;
    grid-template-columns: repeat(3,1fr);
    grid-template-rows: repeat(3,100px);
    grid-column-gap: 50px;
    grid-row-gap: 15px;
    background: pink;
    .item{
        border: 2px solid palegoldenrod;
        color: #fff;
        text-align: center;
        font-size: 20px;
    }
    .item1{
        grid-row: 2 / span 2;
        grid-column: 1 / span 2;
        background: #fffa90;
        color: #000;
    }
}
</style>