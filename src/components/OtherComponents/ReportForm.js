import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../../context/userContext';
import { useTheme } from '../../context/ThemeProvider';

const ReportModal = ({ section,userId, publisherId, localhosturl }) => {
 // console.log(publisherId)
 const { userData } = useContext(UserContext);
 const { isDarkTheme } = useTheme();
  const [selectedReportType, setSelectedReportType] = useState('');
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
   const [hasReported, setHasReported] = useState(false); 

  const handleSubmit = async () => {
    const reportData1 = {
      userId,
      publisherId,
      reportType: selectedReportType,
      reason,
      details,
    };
    const reportData = {
      userId: userId,
      publisherId: publisherId,
      section,
      //section: "Profile",
      reportType: selectedReportType,
      reason: reason,
      details: details,
  };
  
    //console.log("Submitting report data:", reportData); 
    if (!userId || !publisherId || !reportData.section || !reportData.reportType || !reason) {
      toast.error('Please provide all required fields.');
      return; 
    }

  
    try {
      const response = await axios.post(`${localhosturl}/reportroute/createreport`, reportData);
      if (response.data.success) {
       // toast.success("Report submitted successfully!");
        resetForm();
      }
      if (response.status === 201) {
        /**
         *  const message = userData.role === 'User Brand' 
    ? `You reported ${publisherId} for ${selectedReportType}.`
    : `New report submitted: ${selectedReportType}. Reason: ${reason}.`;

         *  const text1 = userRole === 'Brand User'
    ? `A report has been submitted by a Brand Usere: ${selectedReportType}. Reason: ${reason}.`
    : `A report has been submitted: ${selectedReportType}. Reason: ${reason}.`;

         * details: {
          message: userRole === 'User Brand' 
            ? `User Brand has reported: ${selectedReportType}. Reason: ${reason}.` 
            : `New report submitted: ${selectedReportType}. Reason: ${reason}.`,
        }, */
        //const text1=`You reported for section: ${section}. Report Type: ${selectedReportType}. Reason: ${reason}.`
        //const text2=`A report has been submitted: ${selectedReportType}. Reason: ${reason}.`
        const text1 = `You, ${userData.name}, reported for section: ${section}. Report Type: ${selectedReportType}. Reason: ${reason}. Additional details: ${details || 'None provided.'}`;
        const text2=`New report submitted by ${userData.name} for section: ${section}. Report Type: ${selectedReportType}. Reason: ${reason}. Additional details: ${details || 'None provided.'}`

        
       const response2= await axios.post(`${localhosturl}/notificationroute/createNotifications`, {
          userId,
          publisherId,
          section,
          status: 'pending',  
          isBookmarked: false,
          formData: {
            reportType: selectedReportType,
            reason: reason,
            details: details,
        },   
        details: {
          text1,text2,
          message: `New report submitted: ${selectedReportType}. Reason: ${reason}. Additional details: ${details || 'None provided.'}`
        }  ,
        userStatus: [
          {
              userId, 
              isSeen: false,
              isBookmarked: false,
          }
      ],
           
         /* details: {
          / message: `New report submitted ${reportType}.`,
           message: `New report submitted: ${selectedReportType}. Reason: ${reason}. Additional details: ${details || 'None provided.'}`
          },*/
        });
        console.log("Resport response ",response2.data)
  
        // const { remainingApplications } = response.data; 
        const users = response.data.data  
        toast.success("Report submitted successfully!");
      //  toast.success('Application applied successfully!');
        setIsFormVisible(false);

      }
    } catch (error) {
      console.error('Error submitting report:', error.response.data); 
      toast.error("Error submitting report. Please try again later.");
    }
  };

  useEffect(() => {
    const checkReportStatus = async () => {
      try {
        const response = await axios.get(`${localhosturl}/reportroute/checkReport`, {
          params: { userId, publisherId },
        });
        setHasReported(response.data.hasReported); 
      } catch (error) {
        console.error('Error checking report status:', error);
      }
    };

    if (userId && publisherId) {
      checkReportStatus();
    }
  }, [userId, publisherId, localhosturl]);
  

  const resetForm = () => {
    setSelectedReportType('');
    setReason('');
    setDetails('');
    setIsFormVisible(false); 
  };

  return (
    <div>
       {hasReported ? (
        <button 
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4 mt-4"
          disabled
        >
          You have already reported this publisher
        </button>
      ) : (
        <button 
          onClick={() => setIsFormVisible(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4 mt-4"
        >
          Report
        </button>
      )}
      {/*<button 
    onClick={() => setIsFormVisible(true)}
    className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
  >
    Report
  </button>*/}
  {isFormVisible &&  <div className="h-100 w-100 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"//"fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 h-100"
  >
      <div className={`${!isDarkTheme?"bg-white":"bg-black"} rounded-lg p-6 `}>
        
          <>
            <h3 className="text-lg font-semibold mb-4">Submit a Report</h3>

            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value)}
              className="mb-2 p-2 border rounded w-full"
            >
              <option value="">Select Report Type</option>
              <option value="Spam">Spam</option>
              <option value="Harassment">Harassment</option>
              <option value="Inappropriate Content">Inappropriate Content</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              placeholder="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mb-2 p-2 border rounded w-full"
              required
            />

            <textarea
              placeholder="Additional details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="mb-2 p-2 border rounded w-full"
            ></textarea>

            <div className="flex justify-between">
              <button onClick={resetForm} className="bg-gray-300 text-black px-4 py-2 rounded">
                Cancel
              </button>
              <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit
              </button>
            </div>
          </>
         
      </div>
    </div>}
 
    </div>
   
  );
};

export default ReportModal;






/*import React, { useContext, useState } from 'react';
import { UserContext } from '../../context/userContext';
import axios from 'axios';
import { useTheme } from '../../context/ThemeProvider';
import { toast } from 'react-toastify';

const ReportForm = ({ section, publisher }) => {
  const { userData, localhosturl } = useContext(UserContext);
  const { isDarkTheme } = useTheme();
  const userId = userData?._id;
  const publisherId = publisher;

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    reason: '',
    details: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${localhosturl}/reportroute/createreport`, {
        userId,
        publisherId,
        section,
        reason: formData.reason,
        details: formData.details,
      });

      if (response.status === 201) {
        toast.success('Report submitted successfully!');
        setIsFormVisible(false);
      }
      setFormData({
        reason: '',
        details: '',
      });
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error('Failed to submit report. Please try again.');
    }
  };

  return (
    <div>
      {!isFormVisible ? (
        <button
          onClick={() => setIsFormVisible(true)}
          className="border bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md"
        >
          Report
        </button>
      ) : (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Report Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-2">Reason:</label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-2">Details:</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsFormVisible(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;
*/