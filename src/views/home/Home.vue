<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true">
      <home-swiper :banners="banners"></home-swiper>
      <recommend-view :recommends="recommends"></recommend-view>
      <feature-view></feature-view>
      <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick"></tab-control>
      <!-- <goods-list :goods="goods[currentType].list"></goods-list> -->
      <goods-list :goods="showGoods"></goods-list>
    </scroll>

    <back-top @click.native="backClick" v-show="isShowBackTop">

    </back-top>
  </div>
</template>

<script>
  import NavBar from 'components/common/navbar/NavBar'
  import Scroll from 'components/common/scroll/Scroll.vue'
  import TabControl from 'components/content/tabControl/TabControl'
  import GoodsList from  'components/content/goods/GoodsList'
  import BackTop from 'components/content/backTop/BackTop'
  
  import HomeSwiper from 'views/home/childComps/HomeSwiper'
  import RecommendView from 'views/home/childComps/RecommendView'
  import FeatureView from 'views/home/childComps/FeatureView'

  import {getHomeMultidata,getHomeGoods} from 'network/home'
  
  export default {
    name:"Home",
    components: {
      NavBar,
      Scroll,
      TabControl,
      GoodsList,
      BackTop,

      HomeSwiper,
      RecommendView,
      FeatureView
    },
    data(){
      return{
        banners:[],
        recommends:[],
        goods: {
        'pop': {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []},
        },
        currentType:'pop',
        isShowBackTop:false
      }  
    },
    computed: {
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata()

      // 2.请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

      //  //3.监听item中图片加载完成
      // this.$bus.$on('itemImageLoad',()=>{
      //   // console.log('----------')
      //   this.$refs.scroll &&  this.$refs.scroll.refresh()
      // })  
    },
    mounted () {
      //3.监听item中图片加载完成
      this.$bus.$on('itemImageLoad',()=>{
        // console.log('----------')
        this.$refs.scroll &&  this.$refs.scroll.refresh()
      })
      
    },
    methods: {
      //事件监听相关的方法
      tabClick(index){
        switch(index){
          case 0:
            this.currentType = 'pop'
            break
          case 1:
            this.currentType = 'new'
            break
          case 2:
            this.currentType = 'sell'
            break
        }
      },
      backClick() {
        this.$refs.scroll.scrollTo(0, 0)
      },
      contentScroll(position){
        // 1.判断BackTop是否显示
        this.isShowBackTop = (-position.y) > 1000
      },
 
      // 网络请求相关的方法
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },

      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1
        })
      }
    }
  }
</script>

<style scoped>
  #home{
    padding-top: 44px;
    /* 100的视口 */
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0px;
    right: 0px;
    top: 0px;
    z-index: 9;
  }

  .tab-control{
    position: sticky;
    top:44px;
    background-color: #fff;
    z-index: 9;
  }

  .content {
    overflow: hidden;

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

/* .content{
    height: calc(100% - 93px);
    overflow: hidden;
    margin-top: 44px;
  } */

</style>


