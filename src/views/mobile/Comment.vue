<template>
    <div class="Comment" ref="Comment">
        <Comment :theId="currentId"></Comment>
    </div>
</template>
<script>
import Comment from '@/components/Comment'
export default {
    data() {
        return {
            currentId: 0
        }
    },
    mounted() {

    },
    components: {
        Comment
    },
    beforeRouteEnter(to, from, next) {
        next(vc => {
            vc.currentId = to.query.currentId
            vc.$store.state.localTop = 'Comment'
            vc.$store.state.localPage = '评论'
        })
    },
    computed: {

    },
    methods: {

    },
}
</script>
<style scoped lang="less">
.Comment {
    padding: 10px 2%;
    position: relative;
    height: 100%;
    overflow-y: auto;
}
</style>
