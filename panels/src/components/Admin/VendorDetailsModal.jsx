import "./VendorDetailsModal.css";

import {
  X,
  User,
  Mail,
  Phone,
  Store,
  MapPin,
  Calendar,
  Globe,
  FileText,
  Eye,
  Download
} from "lucide-react";

const VendorDetailsModal = ({
  open,
  onClose,
  vendor
}) => {

  if (!open || !vendor) return null;

  return (

    <div className="admin-vendor-detail-overlay">

      <div className="admin-vendor-detail-modal">

        {/* ======================================================
                        HEADER
        ====================================================== */}

        <div className="admin-vendor-detail-header">

          <div className="admin-vendor-detail-profile">

            {

              vendor.profileImage ?

              (

                <img
                  src={vendor.profileImage}
                  alt={vendor.vendorName}
                  className="admin-vendor-detail-image"
                />

              )

              :

              (

                <div className="admin-vendor-detail-avatar">

                  {

                    vendor.vendorName

                      ?.split(" ")

                      .map(name => name[0])

                      .join("")

                      .substring(0,2)

                      .toUpperCase()

                  }

                </div>

              )

            }

            <div>

              <h2>

                {vendor.businessName || vendor.vendorName}

              </h2>

              <p>

                {vendor.vendorId || "-"}

              </p>

            </div>

          </div>

          <button

            className="admin-vendor-detail-close"

            onClick={onClose}

          >

            <X size={22}/>

          </button>

        </div>

        {/* ======================================================
                        BODY
        ====================================================== */}

        <div className="admin-vendor-detail-body">

          {/* ======================================================
                          LEFT
          ====================================================== */}

          <div className="admin-vendor-detail-left">

            {/* Personal Information */}

            <div className="admin-vendor-detail-card">

              <h3>

                <User size={18}/>

                Personal Information

              </h3>

              <div className="admin-vendor-detail-grid">

                <div>

                  <label>Vendor Name</label>

                  <p>

                    {vendor.vendorName || "-"}

                  </p>

                </div>

                <div>

                  <label>Owner Name</label>

                  <p>

                    {vendor.ownerName || "-"}

                  </p>

                </div>

                <div>

                  <label>

                    <Mail size={15}/>

                    Email

                  </label>

                  <p>

                    {vendor.email || "-"}

                  </p>

                </div>

                <div>

                  <label>

                    <Phone size={15}/>

                    Phone

                  </label>

                  <p>

                    {vendor.phone || "-"}

                  </p>

                </div>

              </div>

            </div>

            {/* Business Information */}

            <div className="admin-vendor-detail-card">

              <h3>

                <Store size={18}/>

                Business Information

              </h3>

              <div className="admin-vendor-detail-grid">

                <div>

                  <label>

                    Business Name

                  </label>

                  <p>

                    {vendor.businessName || "-"}

                  </p>

                </div>

                <div>

                  <label>

                    Business Type

                  </label>

                  <p>

                    {vendor.businessType || "-"}

                  </p>

                </div>

                <div>

                  <label>

                    Category

                  </label>

                  <p>

                    {vendor.businessCategory || "-"}

                  </p>

                </div>

                <div>

                  <label>

                    <Calendar size={15}/>

                    Established

                  </label>

                  <p>

                    {vendor.establishedYear || "-"}

                  </p>

                </div>

                <div className="admin-vendor-detail-full">

                  <label>

                    Description

                  </label>

                  <p>

                    {vendor.businessDescription || "-"}

                  </p>

                </div>

                <div className="admin-vendor-detail-full">

                  <label>

                    <Globe size={15}/>

                    Website

                  </label>

                  <p>

                    {vendor.website || "-"}

                  </p>

                </div>

              </div>

            </div>
                        {/* ======================================================
                          Business Address
            ====================================================== */}

            <div className="admin-vendor-detail-card">

              <h3>

                <MapPin size={18}/>

                Business Address

              </h3>

              <div className="admin-vendor-detail-grid">

                <div className="admin-vendor-detail-full">

                  <label>Address</label>

                  <p>

                    {vendor.address?.locality || "-"},{" "}

                    {vendor.address?.city || "-"},{" "}

                    {vendor.address?.state || "-"},{" "}

                    {vendor.address?.country || "-"}

                  </p>

                </div>

                <div>

                  <label>Pincode</label>

                  <p>

                    {vendor.address?.pincode || "-"}

                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ======================================================
                          RIGHT SIDE
          ====================================================== */}

          <div className="admin-vendor-detail-right">

            {/* ======================================================
                            Statistics
            ====================================================== */}

            <div className="admin-vendor-detail-card">

              <h3>

                <Store size={18}/>

                Statistics

              </h3>

              <div className="admin-vendor-detail-stats">

                <div className="admin-vendor-detail-stat-box">

                  <span>Total Products</span>

                  <h2>

                    {vendor.productCount || 0}

                  </h2>

                </div>

                <div className="admin-vendor-detail-stat-box">

                  <span>Orders (30 Days)</span>

                  <h2>

                    {vendor.last30DaysOrders || 0}

                  </h2>

                </div>

                <div className="admin-vendor-detail-stat-box">

                  <span>Revenue (30 Days)</span>

                  <h2>

                    ₹

                    {(vendor.last30DaysRevenue || 0).toLocaleString("en-IN")}

                  </h2>

                </div>

              </div>

            </div>

            {/* ======================================================
                            Status
            ====================================================== */}

            <div className="admin-vendor-detail-card">

              <h3>

                Status Information

              </h3>

              <div className="admin-vendor-detail-status-list">

                <div className="admin-vendor-detail-status-item">

                  <label>KYC Status</label>

                  <span

                    className={`admin-vendor-detail-chip ${

                      (vendor.kycStatus || "").toLowerCase()

                    }`}

                  >

                    {vendor.kycStatus || "-"}

                  </span>

                </div>

                <div className="admin-vendor-detail-status-item">

                  <label>Approval Status</label>

                  <span

                    className={`admin-vendor-detail-chip ${

                      (vendor.approvalStatus || "").toLowerCase()

                    }`}

                  >

                    {vendor.approvalStatus || "-"}

                  </span>

                </div>

                <div className="admin-vendor-detail-status-item">

                  <label>Store Status</label>

                  <span

                    className={`admin-vendor-detail-chip ${

                      (vendor.storeStatus || "").toLowerCase()

                    }`}

                  >

                    {vendor.storeStatus || "-"}

                  </span>

                </div>

                <div className="admin-vendor-detail-status-item">

                  <label>Joined</label>

                  <span>

                    {

                      vendor.joinedDate

                      ?

                      new Date(

                        vendor.joinedDate

                      ).toLocaleDateString()

                      :

                      "-"

                    }

                  </span>

                </div>

              </div>

            </div>
                        {/* ======================================================
                          DOCUMENTS
            ====================================================== */}

            <div className="admin-vendor-detail-card">

              <h3>

                <FileText size={18}/>

                KYC Documents

              </h3>

              <div className="admin-vendor-detail-documents">

                {/* PAN */}

                <div className="admin-vendor-detail-document">

                  <div>

                    <h4>PAN Card</h4>

                    <p>

                      {vendor.documents?.pan?.number || "Not Available"}

                    </p>

                  </div>

                  {

                    vendor.documents?.pan?.url ?

                    (

                      <div className="admin-vendor-detail-document-actions">

                        <button

                          onClick={()=>

                            window.open(

                              vendor.documents?.pan?.url,

                              "_blank"

                            )

                          }

                        >

                          <Eye size={16}/>

                          Preview

                        </button>

                        <a

                          href={vendor.documents?.pan?.url}

                          target="_blank"

                          rel="noreferrer"

                          download

                        >

                          <Download size={16}/>

                          Download

                        </a>

                      </div>

                    )

                    :

                    <span>

                      No File

                    </span>

                  }

                </div>

                {/* Aadhaar */}

                <div className="admin-vendor-detail-document">

                  <div>

                    <h4>Aadhaar Card</h4>

                    <p>

                      {vendor.documents?.aadhaar?.number || "Not Available"}

                    </p>

                  </div>

                  {

                    vendor.documents?.aadhaar?.url ?

                    (

                      <div className="admin-vendor-detail-document-actions">

                        <button

                          onClick={()=>

                            window.open(

                              vendor.documents?.aadhaar?.url, 

                              "_blank"

                            )

                          }

                        >

                          <Eye size={16}/>

                          Preview

                        </button>

                        <a

                          href={vendor.documents?.aadhaar?.url}

                          target="_blank"

                          rel="noreferrer"

                          download

                        >

                          <Download size={16}/>

                          Download

                        </a>

                      </div>

                    )

                    :

                    <span>

                      No File

                    </span>

                  }

                </div>

                {/* GST */}

                <div className="admin-vendor-detail-document">

                  <div>

                    <h4>GST Certificate</h4>

                    <p>

                      {vendor.documents?.gst?.number|| "Not Available"}

                    </p>

                  </div>

                  {

                    vendor.documents?.gst?.url ?

                    (

                      <div className="admin-vendor-detail-document-actions">

                        <button

                          onClick={()=>

                            window.open(

                              vendor.documents?.gst?.url,

                              "_blank"

                            )

                          }

                        >

                          <Eye size={16}/>

                          Preview

                        </button>

                        <a

                          href={vendor.documents?.gst?.url}

                          target="_blank"

                          rel="noreferrer"

                          download

                        >

                          <Download size={16}/>

                          Download

                        </a>

                      </div>

                    )

                    :

                    <span>

                      No File

                    </span>

                  }

                </div>

                {/* Business Registration */}

                <div className="admin-vendor-detail-document">

                  <div>

                    <h4>

                      Business Registration

                    </h4>

                    <p>

{vendor.documents?.businessRegistration?.number || "Not Available"}

</p>

                  </div>

                  {

                    vendor.documents?.businessRegistration?.url ?

                    (

                      <div className="admin-vendor-detail-document-actions">

                        <button

                          onClick={()=>

                            window.open(

                              vendor.documents?.businessRegistration?.url,

                              "_blank"

                            )

                          }

                        >

                          <Eye size={16}/>

                          Preview

                        </button>

                        <a

                          href={vendor.documents?.businessRegistration?.url}

                          target="_blank"

                          rel="noreferrer"

                          download

                        >

                          <Download size={16}/>

                          Download

                        </a>

                      </div>

                    )

                    :

                    <span>

                      No File

                    </span>

                  }

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};

export default VendorDetailsModal;