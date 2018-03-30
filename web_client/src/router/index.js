import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import LogMessage from "@/components/LogMessage"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
    	path:"/logmessage/:id",
    	name:"LogMessage",
    	component:LogMessage
    }
  ]
})
