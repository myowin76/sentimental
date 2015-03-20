class AdminController < ApplicationController
	before_action :authenticate_user!, :except => [:show]
	layout 'admin'
  def dashboard
  	@surveys = current_user.surveys

  end

  def report
		@surveys = current_user.surveys  	
  end
end
