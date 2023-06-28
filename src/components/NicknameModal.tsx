import { useEffect, useRef } from 'react'

interface NicknameModalProps {
  submitScore: (ev: React.FormEvent<HTMLFormElement>) => void
}

export function NicknameModal({ submitScore }: NicknameModalProps) {
  const formRef = useRef<HTMLFormElement | null>(null)

  useEffect(() => {
    formRef.current?.focus()
  }, [])

  return (
    <div className='fixed top-1/2 left-1/2 p-4 bg-stone-950 rounded-lg -translate-x-1/2 -translate-y-1/2'>
      <form ref={formRef} onSubmit={submitScore}>
        <h2 className='mb-5 text-xl'>Felicidades tu puntuación es una de las mejores</h2>
        <p id='errorMessage' className='hidden mb-2.5 text-red-400' aria-live='polite'>
          El nombre debe tener entre tres y ocho caracteres alfanuméricos
        </p>
        <label htmlFor='nickname' className='block mb-3.5 text-lg'>
          Ingresa tu nombre
        </label>
        <input
          type='text'
          name='nickname'
          id='form-name'
          className='mb-4 px-2 py-1.5 w-full bg-stone-800 text-white text-lg inputTransition placeholder:opacity-90 placeholder:text-white'
          pattern='[a-zA-ZñÑ0-9]{3,8}'
          title='El nombre puede tener de tres a ocho caracteres'
          placeholder='aimlab'
          autoComplete='nickname'
        />
        <button
          type='submit'
          className='block mx-auto px-3 py-1.5 rounded-md w-fit bg-stone-900 hover:bg-stone-800 active:bg-stone-800'
        >
          Guardar
        </button>
      </form>
    </div>
  )
}
