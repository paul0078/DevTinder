*order of the route tested

API LIST
- POST /signup
- POST /login
- POST /logout


## profileRouter
 - GET /profile/view
 - PATCH /profile/edit
 - GET /profile/password // forgot password


## connectionRequestRouter
- POST /request/send/:status/:userId   => status is dynamic using  --> ignored , intrested
- POST /request/review/:status/:requestId  => status is dynamic using --> accepted , Rejected

# status
========
ignored , intrested 
              / \
      accepted   Rejected
         
## userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed -Gets you the profiles of other users on platforms


