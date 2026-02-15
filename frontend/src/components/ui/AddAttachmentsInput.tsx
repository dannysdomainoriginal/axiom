import type { TaskSchema } from "@/schemas";
import React, { useState, useEffect } from "react";
import { useController, type Control } from "react-hook-form";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";
import { useGoogleLogin } from "@react-oauth/google";
import useCookies from "@/hooks/utilities/useCookies";
import axios from "axios";
import { toast } from "@/libraries/sweetalert2";

type Props = {
  control: Control<TaskSchema>;
};

const AddAttachmentsInput = ({ control }: Props) => {
  const [option, setOption] = useState("");
  const {
    field: { value: attachments, onChange },
  } = useController({
    name: "attachments",
    control,
  });

  const setAttachments = (arg: typeof attachments) => onChange(arg);
  const [token, setToken, removeToken] = useCookies<string | null>(
    "quiqw:axiom-task-manager:google-token",
    null,
    1 / 24,
  );

  /* -------------------------------------------------------------------------- */
  /*                             GOOGLE PICKER SETUP                            */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;

    const onLoad = () =>
      (window as any).gapi.load("picker", () => {
        console.log("Picker API loaded");
      });

    script.addEventListener("load", onLoad);
    document.body.appendChild(script);

    return () => {
      // Remove token
      removeToken();

      // Remove script from DOM
      script.removeEventListener("load", onLoad);
      document.body.removeChild(script);
    };
  }, []);

  /* ---------------------------- Callback Function --------------------------- */
  const callBackFunction = async (data: any) => {
    const google = (window as any).google;

    if (data.action === google.picker.Action.PICKED) {
      const file = data.docs[0];
      const fileId = file.id;

      try {
        // 1️⃣ Make file viewable by anyone with link
        await axios.post(
          `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
          {
            role: "reader",
            type: "anyone", // anyone with the link
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // your OAuth access token
              "Content-Type": "application/json",
            },
          },
        );

        // 2️⃣ Fetch the shareable link
        const { data: fileData } = await axios.get(
          `https://www.googleapis.com/drive/v3/files/${fileId}?fields=webViewLink`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const shareableLink = fileData.webViewLink;

        // 3️⃣ Add the shareable link to attachments
        setAttachments([...(attachments || []), shareableLink]);
      } catch (err) {
        console.error("Error making file shareable:", err);
        alert(
          "Failed to create shareable link. Please check your token/permissions.",
        );
      }
    }
  };

  /* ---------------------------- OpenDrive Picker ---------------------------- */
  const openDrivePicker = (token: string) => {
    const google = (window as any).google;

    const view = new google.picker.DocsView()
      .setIncludeFolders(true)
      .setSelectFolderEnabled(false)
      .setOwnedByMe(true) // only show files you own
      .setMimeTypes(
        "application/pdf,image/png,image/jpeg,application/vnd.google-apps.document",
      )
      .setParent("root");

    const picker = new google.picker.PickerBuilder()
      .setOAuthToken(token)
      .setDeveloperKey(import.meta.env.VITE_GOOGLE_API_KEY) // Found in Cloud Console Credentials
      .addView(view)
      .setCallback((data: any) => {
        if (data.action === google.picker.Action.PICKED) {
          const file = data.docs[0];
          const shareableLink = file.url; // may not be public
          setAttachments([...(attachments || []), shareableLink]);
          toast.success(
            "Attachment added.\nConfirm the file is set to ‘Anyone with the link can view’.",
          );
        }
      })
      .build();

    picker.setVisible(true);
  };

  /* ---------------------------- React oauth hook ---------------------------- */
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.file",
    onSuccess: ({ access_token }) => {
      setToken(access_token);
      openDrivePicker(access_token);
    },
  });

  /* --------------------------- Handle Drive Click --------------------------- */
  const handleDriveClick = () => {
    if (token) {
      openDrivePicker(token);
    } else {
      login(); // Trigger login/token refresh and open picker on success
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                             COMPONENT HANDLERS                             */
  /* -------------------------------------------------------------------------- */

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...(attachments || []), option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index: number) => {
    setAttachments(attachments?.filter((_, idx) => idx !== index) || []);
  };

  /* -------------------------------------------------------------------------- */
  /*                              RENDER COMPONENT                              */
  /* -------------------------------------------------------------------------- */
  return (
    <div>
      {attachments?.map((item, idx) => (
        <div
          key={idx}
          className="flex justify-between bg-gray-50 border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <div className="flex-1 flex items-center gap-3 min-w-0">
            <LuPaperclip className="text-gray-400" />
            <p className="text-sm text-black truncate">{item}</p>
          </div>
          <button type="button" onClick={() => handleDeleteOption(idx)}>
            <HiOutlineTrash className="text-lg text-red-500" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <div className="flex-1 flex items-center gap-3 border border-gray-100 rounded-md px-3">
          <LuPaperclip
            onClick={handleDriveClick}
            className="text-gray-400 cursor-pointer hover:text-blue-500"
            title="Upload from Google Drive"
          />
          <input
            type="text"
            placeholder="Paste URL or use the clip to browse Drive"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-[13px] text-black outline-none bg-white py-2"
          />
        </div>

        <button
          type="button"
          className="card-btn flex items-center gap-1"
          onClick={handleAddOption}
          disabled={!option.trim()}
        >
          <HiMiniPlus className="text-lg" />
          Add
        </button>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
