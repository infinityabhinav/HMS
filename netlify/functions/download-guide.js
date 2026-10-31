import { downloadGuideResponse } from '../../server/guide-delivery.js'

export default {
  fetch(request) {
    return downloadGuideResponse(request)
  },
}
