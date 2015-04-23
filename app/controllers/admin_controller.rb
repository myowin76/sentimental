class AdminController < ApplicationController
	before_action :authenticate_user!, :except => [:show]
	layout 'admin'

  def dashboard
  	@surveys = current_user.surveys

  end

  def report
		  	
		@surveys = current_user.surveys
		# byebug
		# @surveys = current_user.surveys.search(params[:search])
		if params[:survey]
			if params[:survey][:survey_id].present?
				@survey = @surveys.find(params[:survey][:survey_id])
			end
			# @survey = @surveys.where('text LIKE%', params[:survey])
		end
		
  end
end
