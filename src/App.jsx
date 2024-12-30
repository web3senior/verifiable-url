import { useRef } from 'react'
import web3 from 'web3'
import toast, { Toaster } from 'react-hot-toast'
import LUKSO from '/LUKSO.svg'
import styles from './App.module.scss'

function App() {
  const cidRef = useRef()
  const output = useRef()

  /**
   * Fetch
   * @param {String} cid
   * @returns
   */
  const fetchIPFS = async (cid) => {
    try {
      const bufferData = await fetch(`${document.querySelector(`[name="gateway"]`).value}${cid}`).then(async (response) => {
        return response.arrayBuffer().then((buffer) => new Uint8Array(buffer))
      })

      return bufferData
    } catch (error) {
      console.log(error)
      return false
    }
  }

  /**
   * Verify
   * @param {Object} e
   */
  const verify = (e) => {
    const t = toast.loading(`Verifing`)

    if (cidRef.current.value.length < 1) {
      toast.error(`Please enter CID`)
    }

    fetchIPFS(cidRef.current.value).then((result) => {
      const hashed = web3.utils.keccak256(result)

      console.log(result)
      console.log(`Verifiable Data`, hashed)

      output.current.value = hashed

      // Dismis toast
      toast.dismiss(t)
    })
  }

  return (
    <>
      <Toaster />
      <div className={`__container`} data-width={`small`}>
        <figure className={`${styles['logo']}`}>
          <img src={LUKSO} alt="Logo" />
          <figcaption>
            <p>Easily Create Verifiable URLs for LUKSO LSPs</p>
            <small>Ensure data integrity and trust with our simple tool.</small>
          </figcaption>
        </figure>

        <div className={`${styles['card']}`}>
          <div className={`d-flex flex-column align-items-start justify-content-center`}>
            <label htmlFor="">Gateway:</label>
            <select name={`gateway`} id="">
              <option>https://api.universalprofile.cloud/ipfs/</option>
              <option>https://ipfs.io/ipfs/</option>
              <option value={``}>None</option>
            </select>
          </div>
          <div className={`d-flex flex-column align-items-start justify-content-center`}>
            <label htmlFor="">CID:</label>
            <input ref={cidRef} type="text" name="" id="" placeholder="CID" />
          </div>
          <div className={`d-flex flex-column align-items-start justify-content-center`}>
            <label htmlFor="">Data:</label>
            <textarea ref={output} name="" id="" onClick={(e) => e.target.select()}></textarea>
          </div>
          <div>
            <button onClick={(e) => verify(e)}>Verify</button>
          </div>
        </div>

        <a href="https://lukso.network/" target="_blank">
          Learn More
        </a>
      </div>
    </>
  )
}

export default App
