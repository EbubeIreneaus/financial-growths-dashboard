<script setup lang="ts">
import {useQuasar} from 'quasar'
import { useRouter} from 'vue-router'
const $q = useQuasar()

$q.cookies.remove('userId')
useRouter().push('/auth/')
</script>

