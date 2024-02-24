import React from "react";

type UploadProps = {
    id: string
    accept: string
    onSuccess: (data: string) => void
    onError: () => void
}

const Upload = (props: Readonly<UploadProps>) => {
    return (<input id={props.id} type='file' accept={props.accept} hidden onChange={event => {
        const upload = event.target as HTMLInputElement;

        if (upload.files && upload.files[0]) {
            const reader = new FileReader();
            reader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
                if (readerEvent?.target?.result) {
                    const data = readerEvent.target.result.toString();
                    try {
                        props.onSuccess(data);
                    } catch (err) {
                        props.onError();
                    }
                }
            }
            reader.readAsText(upload.files[0], 'UTF-8');
        }
        upload.value = '';
    }}/>);
}

export default Upload;