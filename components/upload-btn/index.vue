<template>
  <div class="mod-upload" @click="$emit('click')">
    <Button type="dashed">
      <i class="anticon anticon-plus">
        <svg viewBox="64 64 896 896" class="" data-icon="plus" width="1em" height="1em" fill="currentColor"
             aria-hidden="true">
          <path
            d="M848 474H550V152h-76v322H176c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h298v322h76V550h298c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"/>
        </svg>
      </i>
      <span><slot/></span>
    </Button>
  </div>
</template>

<script>
//  import { ajaxUp } from 'upload'
  export default {}
</script>

<style scoped lang="less">
  .mod-upload {
    display: block;
    max-width: 100%;
    cursor: pointer;
    button {
      width: 100%;
      height: 100%;
      transition: all .3s cubic-bezier(.645,.045,.355,1);
      &:hover {
        span {
          color: #40a9ff;
        }
      }
      i {
        transition: margin-left .3s cubic-bezier(.645,.045,.355,1);
        line-height: 14px;
        vertical-align: -.125em;
        svg {
          line-height: 1;
          font-size: 14px;
        }
      }
      span {
        transition: all .3s cubic-bezier(.645,.045,.355,1);
        margin-left: 8px;
        color: rgba(0,0,0,.45);
        font-weight: 400;
        font-size: 14px;
        line-height: 1.499;
      }
    }
  }
</style>
