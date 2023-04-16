<template>
    <div>
        <!-- 您的组件模板代码 -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [
                {
                    name:"sam",
                    value:2
                },
                {
                    name: "sam",
                },
                {
                    name: 'sam',
                },
                {
                    name:"ham",
                    value:3
                },
                {
                    name:"ham",
                    value:3
                }
            ],
            fullname:"sam zhang",
        };
    },
    methods: {
      myNewMethod() {
          let a = {
              name:"sam",
          }
        console.log('这是一个新方法');
      },

    },
    mounted() {
        this.myNewMethod();
        console.log(111);
    },
};
</script>

<style scoped>
/* 您的组件样式 */
</style>