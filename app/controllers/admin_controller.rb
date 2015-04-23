class AdminController < ApplicationController
	before_action :authenticate_user!, :except => [:show]
	layout 'admin'
	respond_to :html, :js, :json

  def dashboard
  	@surveys = current_user.surveys

  end

  def report
		  	
		@surveys = current_user.surveys
		
		# @surveys = current_user.surveys.search(params[:search])
		
		
		if params[:survey] && params[:survey][:survey_id].present?
			@survey = @surveys.find(params[:survey][:survey_id])

			
		end

		if params[:search].present?
			@client_surveys = @survey.client_surveys.textSearch(params[:search])
		end
	
			date_from = params[:date_from].present? ? DateTime.parse(params[:date_from]) : DateTime.parse('01/01/2000')
	    date_to = params[:date_to].present? ? DateTime.parse(params[:date_to]) : DateTime.now
	          
		@client_surveys = @survey.client_surveys.find_between(date_from, date_to)



			# byebug
			
			# respond_to do |format|
	  #     format.js {
		 #      render :partial => 'report', 
		 #      	:locals => { :surveys => @surveys }
		 #    }
	  #   end
		
		
  end
end
