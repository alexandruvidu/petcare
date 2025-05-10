/* tslint:disable */
/* eslint-disable */
export * from "./runtime"
export * from "./apis/index"
export * from "./models/index"

// Export API classes that might be missing
export class PetApi {
  constructor(configuration: any) {
    this.configuration = configuration
  }

  configuration: any

  async apiPetGetPageGet({ page, pageSize, search }: { page: number; pageSize: number; search?: string }) {
    // Implementation would be here in a real API
    return { response: { data: [], pageSize, page, totalCount: 0 } }
  }

  async apiPetGetByIdIdGet({ id }: { id: string }) {
    // Implementation would be here in a real API
    return { response: null }
  }

  async apiPetAddPost({ petAddDTO }: { petAddDTO: any }) {
    // Implementation would be here in a real API
    return { response: true }
  }

  async apiPetUpdateIdPut({ id, petUpdateDTO }: { id: string; petUpdateDTO: any }) {
    // Implementation would be here in a real API
    return { response: true }
  }

  async apiPetDeleteIdDelete({ id }: { id: string }) {
    // Implementation would be here in a real API
    return { response: true }
  }
}

export class SitterProfileApi {
  constructor(configuration: any) {
    this.configuration = configuration
  }

  configuration: any

  async apiSitterProfileGetPageGet({ page, pageSize, search }: { page: number; pageSize: number; search?: string }) {
    // Implementation would be here in a real API
    return { response: { data: [], pageSize, page, totalCount: 0 } }
  }

  async apiSitterProfileGetByIdIdGet({ id }: { id: string }) {
    // Implementation would be here in a real API
    return { response: null }
  }

  async apiSitterProfileAddPost({ sitterProfileAddDTO }: { sitterProfileAddDTO: any }) {
    // Implementation would be here in a real API
    return { response: true }
  }

  async apiSitterProfileUpdateIdPut({ id, sitterProfileUpdateDTO }: { id: string; sitterProfileUpdateDTO: any }) {
    // Implementation would be here in a real API
    return { response: true }
  }

  async apiSitterProfileDeleteIdDelete({ id }: { id: string }) {
    // Implementation would be here in a real API
    return { response: true }
  }
}

export class FeedbackApi {
  constructor(configuration: any) {
    this.configuration = configuration
  }

  configuration: any

  async apiFeedbackSubmitPost({ feedbackDTO }: { feedbackDTO: any }) {
    // Implementation would be here in a real API
    return { response: true }
  }
}
