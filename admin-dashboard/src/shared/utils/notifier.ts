import Swal from 'sweetalert2'

const toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

const notifier = {
    success(message: string) {
        toast.fire({
            icon: 'success',
            title: message
        })
    },
    error(message: string) {
        toast.fire({
            icon: 'error',
            title: message
        })
    },
    confirm(
        title: string,
        text: string,
        confirmButtonText: string = 'Ya, lakukan!'
    ): Promise<{ isConfirmed: boolean }> {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Batal'
        })
    }
}

export default notifier