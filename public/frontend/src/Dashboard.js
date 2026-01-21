import React ,{ useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard(){
       const navigate = useNavigate();
       const [user, setUser]  = useState(null);
       const [loading, setLoading] = useState(true);

    
       useEffect(()=> {

        //user login checking
        const token = localStorage.getItem('auth_token');
        const savedUser = localStorage.getItem('user'); 

        if(!token || !savedUser){
            navigate('/login');
            return;
        }    
  
        //fetch user data
        fetchUserData(); 
       }, [navigate]);
       
       const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch('http://community-sharing-platform.test/api/user',{
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if(response.ok){
                const data = await response.json();
                setUser(data.user);
            }else{
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');
                navigate("/login");
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            navigate('/login')
        }finally{
            setLoading(false);
        }
       };

       const handelLogout  = async ()=> {
        try {
            const token = localStorage.getItem('auth_token');
            await fetch('http://community-sharing-platform.test/api/logout',{
                method: 'POST',
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
        } catch (error) {
            console.log('Logout error:', error);
        }finally{
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            navigate('/login');
        }
       };

       if(loading){
        return (
            <div className="loading">
                <p>loading your dashboard...</p>
            </div>
        );
       }
                return(
                    <div className="dashboard">
                        <header className="dashboard-header">
                        <div className="user-info">
                            
                            <h2>Welcome, {user?.name}! </h2>
                            
                            <p>{user.email}</p>

                            <p className="member-since">
                                Member since: {new Date(user?.created_at).toLocaleDateString()}
                            </p>

                            </div>    
                            <button className="btn-logout" onClick={handelLogout}>Logout</button>
                        </header>  

                        <div className="dashboard-grid">
                            <div className="status-grid">
                                <div className="stat-card">
                                    <h3>Tools Shared</h3>
                                    <p className="stat-number">0</p>
                                    <small>Items you're sharing</small>
                                </div>
                                <div className="stat-card">
                                    <h3>Trust Score</h3>
                                    <p className="stat-number">100</p>
                                    <small>Starting score</small>
                                </div>
                                <div className="stat-card">
                                    <h3>Transactions</h3>
                                    <p className="stat-number">0</p>
                                    <small>successful exchange</small>
                                </div>
                                <div className="stat-card">
                                    <h3>Neighborhood</h3>
                                    <p className="stat-number">--</p>
                                    <small>Set your location</small>
                                </div>
                            </div>

                            <div className="quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="actions-buttons">
                                    <button className="btn-action primary" 
                                            onClick={()=>navigate('/tools/add')}>
                                        Share a Tool
                                    </button>
                                    <button className="btn-action secondary"
                                            onClick={()=> navigate('/skills')}>
                                        offer a Skill
                                    </button>
                                    <button className="btn-action tertiary"
                                            onClick={()=>navigate('/events/create')}>
                                        create Event
                                    </button>
                                    <button className="btn-action outline"
                                            onClick={()=>navigate('/profile')}>
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                

                        /*----Recent activity---*/
                            <div className="recent-activity">
                                <h3>Recent Activity</h3>
                                    <div className="activity-list">
                                        <p className="empty-state">
                                            No activity yet, Start sharing with your neighbors!
                                        </p>
                                    </div>
                            </div>


                            /*------community stats---*/
                            <div className="community Overview">
                                <h3>Community Overview</h3>
                                <ul>
                                    <li><strong>Total Users:</strong>loading...</li>
                                    <li><strong>Total Available:</strong>loading...</li>
                                    <li><strong>Skills Offered:</strong>loading...</li>
                                    <li><strong>Upcoming Events:</strong>loading...</li>
                                </ul>
                            </div>
                        </div>

                        <div className="getting-started">
                            <h3>Getting Started</h3>
                            <ol>
                                <li>Complete your profile with locations</li>
                                <li>Add tools you're willing to share</li>
                                <li>Browse tools form neighbors</li>
                                <li>Join or create community</li>
                                <li>Build your trust score by participating</li>
                            </ol>
                        </div>
                    </div>
                );

}

export default Dashboard;