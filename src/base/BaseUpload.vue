<script setup lang="ts">
import { ref, watch } from "vue";
import { storage } from "../firebase/firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const emit = defineEmits(["change","clear"]);

const props = defineProps<{
  url: string;
  type?: string;
  index?: number
}>();

const fileUrl = ref<string>("");
const input = ref();
const urlImg = ref('')

watch(()=> props.url, ()=>{
  urlImg.value = props.url
})

const handleOpenSelectFile = () => {
  const target = input.value as HTMLInputElement;
  target.click();
};

const handleRemoveImage = () => {
  fileUrl.value = "";
  input.value.value = "";
  urlImg.value = ''

  emit('clear', props.index, props.type)

};

const handleChooseImage = async (event: Event) => {
  const target = event.target as HTMLInputElement;

  if (!target.files) return;

  const file = target.files[0];

  if (file) {
    try {
      const fileRef = storageRef(storage, `uploads/${file.name}`);

      await uploadBytes(fileRef, file);

      fileUrl.value = await getDownloadURL(fileRef);

      if (fileUrl.value) emit("change", fileUrl.value, props.type, props.index);
    } catch (error) {}
  }
};

watch(props, () => (fileUrl.value = props.url as string));
</script>

<template>
  <div class="upload-container">
    <el-icon v-if="fileUrl || url" class="close-icon" @click="handleRemoveImage">
      <CloseBold />
    </el-icon>
    <div class="main" @click="handleOpenSelectFile">
      <img v-if="url || fileUrl" :src="url || fileUrl" alt="Ảnh ứng dụng" />
      <el-icon v-else="!fileUrl">
        <el-icon style="color: gray">
          <UploadFilled />
        </el-icon>
      </el-icon>
      <input ref="input" type="file" hidden @change="handleChooseImage" />
    </div>
  </div>
</template>

<style lang="scss">
.upload-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .close-icon {
    cursor: pointer;
    color: gray;
  }

  .main {
    width: 156px;
    height: 156px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 2px dotted rgba(128, 128, 128, 0.507);
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
