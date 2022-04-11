import * as Y from 'yjs'
import { Observable, Subject } from 'rxjs'

class YjsParkyDBProvider extends Subject<any> {
  /**
   * @param {Y.Doc} ydoc
   */
  constructor(ydoc) {
    super()

    ydoc.on('update', (update, origin) => {
      // ignore updates applied by this provider
      if (origin !== this) {
        // this update was produced either locally or by another provider.
        this.next({ update })
      }
    })
    // listen to an event that fires when a remote update is received
    this.subscribe((update) => {
      Y.applyUpdate(ydoc, update, this) // the third parameter sets the transaction-origin
    })
  }
}
