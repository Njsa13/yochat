import { X } from "lucide-react";

function ImagePreview(props) {
  return (
    <div className="messages-container flex-1 p-5 flex flex-col overflow-y-auto gap-4">
      <div className="flex">
        <button
          className="text-[#8A8C8E] hover:text-base-content transition-colors duration-300"
          onClick={() => {
            props.setImagePreview(null);
            if (props.imageRef.current) props.imageRef.current.value = "";
          }}
        >
          <X />
        </button>
      </div>
      <div className="flex justify-center h-full">
        <img
          src={props.imagePreview}
          alt="image preview"
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}

export default ImagePreview;
