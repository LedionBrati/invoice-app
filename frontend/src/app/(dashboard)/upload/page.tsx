import { PdfUploader } from "@/components/upload/pdf-uploader";

export default function UploadPage() {
    return (
        <div className="flex flex-col items-center py-12">
            <PdfUploader />
        </div>
    );
}
