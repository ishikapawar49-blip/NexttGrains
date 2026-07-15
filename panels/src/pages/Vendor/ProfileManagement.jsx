import "./ProfileManagement.css";

import { useEffect, useRef, useState } from "react";
import axios from "axios";

import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  BadgeCheck,
  Upload,
  Save,
  Image,
  FileText,
  ShieldCheck,
  Loader2,
  Trash2,
} from "lucide-react";

const API = "http://localhost:5000/api/vendor/profile";

function ProfileManagement() {

  const token = localStorage.getItem("vendorToken");

  /* ==========================================================
      FILE INPUT REFS
  ========================================================== */

  const imageRef = useRef(null);

  const panRef = useRef(null);

 const aadhaarRef = useRef(null);

  const gstRef = useRef(null);

  const businessRef = useRef(null);

  /* ==========================================================
      LOADING STATES
  ========================================================== */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);

  /* ==========================================================
      PROFILE DATA
  ========================================================== */

  const [profile, setProfile] = useState({
    name: "",

    email: "",

    phone: "",

    vendorProfile: {
      vendorId: "",

      profileImage: {
        url: "",
        publicId: "",
      },

      ownerName: "",

      businessName: "",

      businessDescription: "",

      businessType: "",

      businessCategory: "",

      establishedYear: "",

      website: "",

      address: {
        locality: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
      },

      location: {
        latitude: "",
        longitude: "",
      },

      documents: {
        pan: {
          number: "",

          file: {
            url: "",
            publicId: "",
          },

          status: "Pending",
        },

aadhaar:{

number:"",

file:{

url:"",
publicId:""

},

status:"Pending"

},

        gst: {
          number: "",

          certificate: {
            url: "",
            publicId: "",
          },

          status: "Pending",
        },

        businessRegistration: {
          number: "",

          file: {
            url: "",
            publicId: "",
          },

          status: "Pending",
        },
      },

      profileCompletion: 0,

      kycStatus: "Incomplete",

      storeStatus: "Draft",
    },
  });

  /* ==========================================================
      FETCH PROFILE
  ========================================================== */

  const fetchProfile = async () => {
    try {

      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(res.data.vendor);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  /* ==========================================================
      HANDLE INPUT CHANGE
  ========================================================== */

  const handleChange = (e) => {

    const { name, value } = e.target;

    if (name.includes(".")) {

      const keys = name.split(".");

      setProfile((prev) => {

        const updated = { ...prev };

        let obj = updated;

        for (let i = 0; i < keys.length - 1; i++) {

          obj = obj[keys[i]];

        }

        obj[keys[keys.length - 1]] = value;

        return { ...updated };

      });

    } else {

      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));

    }
  };

    /* ==========================================================
      SAVE PROFILE
  ========================================================== */

  const saveProfile = async () => {

    try {

      setSaving(true);

      await axios.put(
        API,
        {
          ownerName: profile.vendorProfile.ownerName,

          businessName: profile.vendorProfile.businessName,

          businessDescription:
            profile.vendorProfile.businessDescription,

          businessType:
            profile.vendorProfile.businessType,

          businessCategory:
            profile.vendorProfile.businessCategory,

          establishedYear:
            profile.vendorProfile.establishedYear,

          website:
            profile.vendorProfile.website,

          address: {
            locality:
              profile.vendorProfile.address.locality,

            city:
              profile.vendorProfile.address.city,

            state:
              profile.vendorProfile.address.state,

            country:
              profile.vendorProfile.address.country,

            pincode:
              profile.vendorProfile.address.pincode,
          },

          location: {
            latitude:
              profile.vendorProfile.location.latitude,

            longitude:
              profile.vendorProfile.location.longitude,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProfile();

      alert("Profile updated successfully.");

    } catch (error) {

      console.log(error);

      alert("Failed to update profile.");

    } finally {

      setSaving(false);

    }
  };



  /* ==========================================================
      UPLOAD PROFILE IMAGE
  ========================================================== */

  const uploadProfileImage = async (file) => {

    if (!file) return;

    try {

      setUploading(true);

      const formData = new FormData();

      formData.append("image", file);

      await axios.post(
        `${API}/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      fetchProfile();

    } catch (error) {

      console.log(error);

      alert("Image upload failed.");

    } finally {

      setUploading(false);

    }
  };



  /* ==========================================================
      UPLOAD KYC DOCUMENT
  ========================================================== */

  const uploadDocument = async (
    documentType,
    documentSide,
    file
  ) => {

    if (!file) return;

    try {

      setUploading(true);

      const formData = new FormData();

      formData.append("document", file);

      formData.append("documentType", documentType);

      if (documentSide) {

        formData.append("documentSide", documentSide);

      }

      await axios.post(
        `${API}/upload-document`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      fetchProfile();

    } catch (error) {

      console.log(error);

      alert("Document upload failed.");

    } finally {

      setUploading(false);

    }
  };



  /* ==========================================================
      UPDATE DOCUMENT NUMBERS
  ========================================================== */

  const updateDocumentDetails = async () => {

    try {

      await axios.put(
        `${API}/document-details`,
        {
          panNumber:
            profile.vendorProfile.documents.pan.number,

          aadhaarNumber:
            profile.vendorProfile.documents.aadhaar.number,

          gstNumber:
            profile.vendorProfile.documents.gst.number,

          businessRegistrationNumber:
            profile.vendorProfile.documents
              .businessRegistration.number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProfile();

    } catch (error) {

      console.log(error);

    }
  };



  /* ==========================================================
      DELETE DOCUMENT
  ========================================================== */

  const deleteDocument = async (
    documentType,
    documentSide = ""
  ) => {

    const confirmDelete = window.confirm(
      "Delete this document?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${API}/document`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          data: {
            documentType,
            documentSide,
          },
        }
      );

      fetchProfile();

    } catch (error) {

      console.log(error);

      alert("Unable to delete document.");

    }
  };
    /* ==========================================================
      INITIAL LOAD
  ========================================================== */

  useEffect(() => {

    fetchProfile();

  }, []);



  /* ==========================================================
      PROFILE IMAGE PICKER
  ========================================================== */

  const chooseProfileImage = () => {

    imageRef.current.click();

  };

  const onProfileImageChange = (e) => {

    if (!e.target.files.length) return;

    uploadProfileImage(e.target.files[0]);

  };



  /* ==========================================================
      PAN CARD
  ========================================================== */

  const choosePan = () => {

    panRef.current.click();

  };

  const onPanChange = (e) => {

    if (!e.target.files.length) return;

    uploadDocument(
      "pan",
      "",
      e.target.files[0]
    );

  };



  /* ==========================================================
      AADHAAR FRONT
  ========================================================== */
const chooseAadhaar = () => {
  aadhaarRef.current.click();
};

const onAadhaarChange = (e) => {
  if (!e.target.files.length) return;

  uploadDocument(
    "aadhaar",
    "",
    e.target.files[0]
  );
};

  /* ==========================================================
      GST CERTIFICATE
  ========================================================== */

  const chooseGST = () => {

    gstRef.current.click();

  };

  const onGSTChange = (e) => {

    if (!e.target.files.length) return;

    uploadDocument(
      "gst",
      "",
      e.target.files[0]
    );

  };



  /* ==========================================================
      BUSINESS REGISTRATION
  ========================================================== */

  const chooseBusinessRegistration = () => {

    businessRef.current.click();

  };

  const onBusinessRegistrationChange = (e) => {

    if (!e.target.files.length) return;

    uploadDocument(
      "businessRegistration",
      "",
      e.target.files[0]
    );

  };



  /* ==========================================================
      OPEN DOCUMENT
  ========================================================== */

//   const openFile = (url) => {

//     if (!url) return;

//     // window.open(url, "_blank");
// window.open(url + ".pdf", "_blank");
//   };



  /* ==========================================================
      STATUS COLOR
  ========================================================== */

  const getStatusClass = (status) => {

    switch (status) {

      case "Verified":
        return "verified";

      case "Rejected":
        return "rejected";

      case "Pending":
        return "pending";

      default:
        return "pending";

    }

  };



  /* ==========================================================
      LOADING SCREEN
  ========================================================== */

  if (loading) {

    return (

      <div className="vendorProfileLoading">

        <Loader2
          size={38}
          className="vendorProfileSpinner"
        />

        <h3>Loading Profile...</h3>

      </div>

    );
  }
  /* ==========================================================
      PAGE UI
  ========================================================== */

  return (

    <div className="vendorProfilePage">

      {/* ================= HEADER ================= */}

      <div className="vendorProfileHeader">

        <div>

          <h1>Profile Management</h1>

          <p>
            Manage your business profile and KYC documents.
          </p>

        </div>

        <button
          className="vendorSaveBtn"
          onClick={saveProfile}
          disabled={saving}
        >

          {
            saving
            ?
            <Loader2
              size={18}
              className="spin"
            />
            :
            <Save size={18}/>
          }

          Save Profile

        </button>

      </div>



      {/* ================= SUMMARY ================= */}

      <div className="vendorSummaryGrid">

        <div className="vendorSummaryCard">

          <span>Profile Completion</span>

          <h2>

            {profile.vendorProfile.profileCompletion}%

          </h2>

        </div>

        <div className="vendorSummaryCard">

          <span>KYC Status</span>

          <h2
            className={
              getStatusClass(
                profile.vendorProfile.kycStatus
              )
            }
          >

            {profile.vendorProfile.kycStatus}

          </h2>

        </div>

        <div className="vendorSummaryCard">

          <span>Store Status</span>

          <h2>

            {profile.vendorProfile.storeStatus}

          </h2>

        </div>

      </div>



      {/* ================= PROFILE CARD ================= */}

      <div className="vendorProfileCard">

        <div className="vendorProfileTop">

          <div className="vendorImageWrapper">

            {

              profile.vendorProfile.profileImage.url

              ?

              <img

                src={
                  profile.vendorProfile.profileImage.url
                }

                alt="profile"

              />

              :

              <div className="vendorProfilePlaceholder">

                <User size={42}/>

              </div>

            }

            <button

              type="button"

              className="vendorImageBtn"

              onClick={chooseProfileImage}

            >

              <Image size={18}/>

            </button>

            <input

              type="file"

              accept="image/*"

              hidden

              ref={imageRef}

              onChange={onProfileImageChange}

            />

          </div>



          <div className="vendorProfileTitle">

            <h2>

              {

                profile.vendorProfile.businessName

                ||

                "Business Name"

              }

            </h2>

            <p>

              {

                profile.vendorProfile.ownerName

                ||

                "Owner Name"

              }

            </p>

          </div>

        </div>



        {/* ================= FORM ================= */}

<form
  className="vendorProfileForm"
  onSubmit={(e) => {
    e.preventDefault();
    saveProfile();
  }}
>
          <div className="vendorInputGroup">

            <label>

              Vendor ID

            </label>

            <input

              value={
                profile.vendorProfile.vendorId
              }

              readOnly

            />

          </div>



          <div className="vendorInputGroup">

            <label>

              Owner Name

            </label>

            <input

              name="vendorProfile.ownerName"

              value={
                profile.vendorProfile.ownerName
              }

              onChange={handleChange}

            />

          </div>



          <div className="vendorInputGroup">

            <label>

              Email

            </label>

            <input

              value={profile.email}

              readOnly

            />

          </div>



          <div className="vendorInputGroup">

            <label>

              Phone

            </label>

            <input

              value={profile.phone}

              readOnly

            />

          </div>



          <div className="vendorInputGroup">

            <label>

              Business Name

            </label>

            <input

              name="vendorProfile.businessName"

              value={
                profile.vendorProfile.businessName
              }

              onChange={handleChange}

            />

          </div>



          <div className="vendorInputGroup">

            <label>

              Website

            </label>

            <input

              name="vendorProfile.website"

              value={
                profile.vendorProfile.website
              }

              onChange={handleChange}

            />

          </div>



          <div className="vendorInputGroup">

            <label>

              Business Type

            </label>

            <input

              name="vendorProfile.businessType"

              value={
                profile.vendorProfile.businessType
              }

              onChange={handleChange}

            />

          </div>



          <div className="vendorInputGroup">

            <label>

              Business Category

            </label>

            <input

              name="vendorProfile.businessCategory"

              value={
                profile.vendorProfile.businessCategory
              }

              onChange={handleChange}

            />

          </div>



          <div className="vendorInputGroup">

            <label>

              Established Year

            </label>

            <input

              type="number"

              name="vendorProfile.establishedYear"

              value={
                profile.vendorProfile.establishedYear || ""
              }

              onChange={handleChange}

            />

          </div>



          <div className="vendorInputGroup vendorFullWidth">

            <label>

              Business Description

            </label>

            <textarea

              rows={5}

              name="vendorProfile.businessDescription"

              value={
                profile.vendorProfile.businessDescription
              }

              onChange={handleChange}

            />

          </div>
                    {/* ==========================================================
              ADDRESS INFORMATION
          ========================================================== */}

          <div className="vendorSectionTitle">

            <MapPin size={20}/>

            <h3>

              Business Address

            </h3>

          </div>

          <div className="vendorInputGroup">

            <label>

              Locality

            </label>

            <input

              name="vendorProfile.address.locality"

              value={
                profile.vendorProfile.address.locality
              }

              onChange={handleChange}

            />

          </div>

          <div className="vendorInputGroup">

            <label>

              City

            </label>

            <input

              name="vendorProfile.address.city"

              value={
                profile.vendorProfile.address.city
              }

              onChange={handleChange}

            />

          </div>

          <div className="vendorInputGroup">

            <label>

              State

            </label>

            <input

              name="vendorProfile.address.state"

              value={
                profile.vendorProfile.address.state
              }

              onChange={handleChange}

            />

          </div>

          <div className="vendorInputGroup">

            <label>

              Country

            </label>

            <input

              name="vendorProfile.address.country"

              value={
                profile.vendorProfile.address.country
              }

              onChange={handleChange}

            />

          </div>

          <div className="vendorInputGroup">

            <label>

              Pincode

            </label>

            <input

              name="vendorProfile.address.pincode"

              value={
                profile.vendorProfile.address.pincode
              }

              onChange={handleChange}

            />

          </div>

          <div className="vendorInputGroup">

            <label>

              Latitude

            </label>

            <input

              type="number"

              step="any"

              name="vendorProfile.location.latitude"

              value={
                profile.vendorProfile.location.latitude || ""
              }

              onChange={handleChange}

            />

          </div>

          <div className="vendorInputGroup">

            <label>

              Longitude

            </label>

            <input

              type="number"

              step="any"

              name="vendorProfile.location.longitude"

              value={
                profile.vendorProfile.location.longitude || ""
              }

              onChange={handleChange}

            />

          </div>



          {/* ==========================================================
              KYC DOCUMENTS
          ========================================================== */}

          <div className="vendorSectionTitle">

            <ShieldCheck size={20}/>

            <h3>

              KYC Verification

            </h3>

          </div>



          {/* ================= PAN CARD ================= */}

          <div className="vendorDocumentCard">

            <div className="vendorDocumentTop">

              <div>

                <h4>

                  PAN Card

                </h4>

                <span
                  className={
                    getStatusClass(
                      profile.vendorProfile.documents.pan.status
                    )
                  }
                >

                  {
                    profile.vendorProfile.documents.pan.status
                  }

                </span>

              </div>

             <Upload
size={22}
className="vendorUploadIcon"
onClick={choosePan}
/>

<input
type="file"
hidden
accept=".jpg,.jpeg,.png,.pdf"
ref={panRef}
onChange={onPanChange}
/>

            </div>

            <input

              placeholder="PAN Number"

              value={
                profile.vendorProfile.documents.pan.number
              }

              onChange={(e)=>

                updateDocumentValue(

                  "pan",

                  "number",

                  e.target.value

                )

              }

            />

            {

              profile.vendorProfile.documents.pan.file.url &&

            // 
            <button
type="button"
onClick={() =>
window.open(
profile.vendorProfile.documents.pan.file.url,
"_blank"
)
}
className="vendorViewLink"
>
View Uploaded PAN
</button>

            }

          </div>



          {/* ================= AADHAAR ================= */}

          <div className="vendorDocumentCard">

            <div className="vendorDocumentTop">

              <div>

                <h4>

                  Aadhaar Card

                </h4>

                <span
                  className={
                    getStatusClass(
                      profile.vendorProfile.documents.aadhaar.status
                    )
                  }
                >

                  {
                    profile.vendorProfile.documents.aadhaar.status
                  }

                </span>

              </div>

           <div className="vendorDocumentActions">
<Upload
size={22}
className="vendorUploadIcon"
onClick={chooseAadhaar}
/>

</div>

<input
type="file"
hidden
accept=".jpg,.jpeg,.png,.pdf"
ref={aadhaarRef}
onChange={onAadhaarChange}
/>
            </div>

            <input

              placeholder="Aadhaar Number"

              value={
                profile.vendorProfile.documents.aadhaar.number
              }

              onChange={(e)=>

                updateDocumentValue(

                  "aadhaar",

                  "number",

                  e.target.value

                )

              }

            />

{
profile.vendorProfile.documents.aadhaar.file.url && (

<a
href={
profile.vendorProfile.documents.aadhaar.file.url
}
target="_blank"
rel="noreferrer"
className="vendorViewLink"
>
View Aadhaar
</a>

)
}
          </div>
                    {/* ================= GST ================= */}

          <div className="vendorDocumentCard">

            <div className="vendorDocumentTop">

              <div>

                <h4>

                  GST Certificate

                </h4>

                <span
                  className={
                    getStatusClass(
                      profile.vendorProfile.documents.gst.status
                    )
                  }
                >

                  {
                    profile.vendorProfile.documents.gst.status
                  }

                </span>

              </div>

              <Upload
                size={22}
                className="vendorUploadIcon"
onClick={chooseGST}
              />
<input
type="file"
hidden
accept=".jpg,.jpeg,.png,.pdf"
ref={gstRef}
onChange={onGSTChange}
/>
            </div>

            <input

              placeholder="GST Number"

              value={
                profile.vendorProfile.documents.gst.number
              }

              onChange={(e)=>

                updateDocumentValue(

                  "gst",

                  "number",

                  e.target.value

                )

              }

            />

            {

              profile.vendorProfile.documents.gst.certificate.url &&

              <a

               href={
profile.vendorProfile.documents.gst.certificate.url
}

                target="_blank"

                rel="noreferrer"

                className="vendorViewLink"

              >

                View GST Certificate

              </a>

            }

          </div>



          {/* ================= BUSINESS REGISTRATION ================= */}

          <div className="vendorDocumentCard">

            <div className="vendorDocumentTop">

              <div>

                <h4>

                  Business Registration

                </h4>

                <span
                  className={
                    getStatusClass(
                      profile.vendorProfile.documents.businessRegistration.status
                    )
                  }
                >

                  {
                    profile.vendorProfile.documents.businessRegistration.status
                  }

                </span>

              </div>

              <Upload
                size={22}
                className="vendorUploadIcon"
onClick={chooseBusinessRegistration}    
          />
<input
type="file"
hidden
accept=".jpg,.jpeg,.png,.pdf"
ref={businessRef}
onChange={onBusinessRegistrationChange}
/>
            </div>

            <input

              placeholder="Registration Number"

              value={
                profile.vendorProfile.documents.businessRegistration.number
              }

              onChange={(e)=>

                updateDocumentValue(

                  "businessRegistration",

                  "number",

                  e.target.value

                )

              }

            />

            {

              profile.vendorProfile.documents.businessRegistration.file.url &&

              <a

                href={
profile.vendorProfile.documents.businessRegistration.file.url
}

                target="_blank"

                rel="noreferrer"

                className="vendorViewLink"

              >

                View Registration Document

              </a>

            }

          </div>

        </form>

      </div>

    </div>

  );

}

export default ProfileManagement;