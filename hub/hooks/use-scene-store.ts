import { create } from "zustand"

interface SceneStore {
  code: string
  setCode: (code: string) => void
}

export const useSceneStore = create<SceneStore>((set) => ({
  code: "",
  setCode: (code: string) => set({ code }),
}))

export const getSceneCode = () => useSceneStore.getState().code
export const setSceneCode = (code: string) =>
  useSceneStore.getState().setCode(code)
