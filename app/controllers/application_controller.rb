class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
 #  layout :layout_by_resource

 #  def layout_by_resource
	# 	if devise_controller?
	# 		if resource_name == :admin
	# 			"devise_admin_application" #admin model will use this layout
	# 		elsif resource_name == :employee
	# 			"devise_employee_application" #employee model will use this
	# 			layout
	# 		else
	# 			"devise_application" #other devise model will use this
	# 			layout
	# 		end
	# 	else
	# 		"application" #default rails application layout
	# 	end
	# end
end
